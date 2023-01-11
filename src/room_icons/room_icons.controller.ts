import { Request, RequestHandler, Response } from 'express';
import * as RoomIconService from './room_icons.service';
import * as fileUpload from 'express-fileupload';
import * as AWS from 'aws-sdk';
import { RoomIcon } from './room_icons.model';
import { validateSync } from 'class-validator';

export const getAllRoomIcons: RequestHandler = async (req: Request, res: Response) => {
    try {
        const room_icons = await RoomIconService.getRoomIcons();

        res.status(200).json({
            room_icons
        });
    } catch (error) {
        console.error('[room_icons.controller][getAllRoomIcons][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active room_icons'
        });
    }
};

export const getRoomIconById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const room_icon = await RoomIconService.getRoomIconById(parseInt(req.params.id));

        res.status(200).json({
            room_icon
        });
    } catch (error) {
        console.error('[room_icons.controller][getRoomIconById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching room_icon'
        });
    }
};

export const getActiveRoomIconsByCompanyId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const room_icons = await RoomIconService.getRoomIconsByStatusAndCompanyId(1, parseInt(req.params.company_id));

        res.status(200).json({
            room_icons
        });
    } catch (error) {
        console.error('[room_icons.controller][getActiveRoomIconsByCompanyId][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active room_icons'
        });
    }
};

export const createRoomIcon: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.files.photos) {
        return res.status(400).send({ error: true, message: 'Invalid image' });
    }

    const file = req.files.photos as fileUpload.UploadedFile;
    const fileKey = `${new Date().getTime()}` + file.name;
    const maxSize = 1048576; // 1 MB = 1048576 bytes

    if (file.size >= maxSize) {
        return res.status(400).send({ error: true, message: 'Invalid image size' });
    }

    if (file.mimetype != "image/jpeg" && file.mimetype != "image/gif" && file.mimetype != "image/png" && file.mimetype != "image/jpg") {
        return res.status(400).send({ error: true, message: 'Invalid image format' });
    }

    const roomIcon = new RoomIcon();
    req.body.icon_images = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    roomIcon.icon_images = req.body.icon_images;
    const errors = validateSync(roomIcon);
    if (errors.length > 0) {
        return res.status(400).send({ message: errors[0].constraints.maxLength });
    } else {
        uploadFileToS3(file, fileKey).then(
            async (e) => {
                try {
                    const result = await RoomIconService.createRoomIcon(req.body);

                    res.status(200).json({
                        "id": result.identifiers[0].id,
                        "icon_images": req.body.icon_images
                    });
                } catch (error) {
                    console.error('[room_icons.controller][createRoomIcon][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
                    res.status(500).json({
                        message: 'There was an error when adding new room_icon'
                    });
                }
            }
        ).catch((error) => {
            return res.status(400).send({ error: true, message: 'Image Upload faild: ' + error.message });
        })
    }
}

export const updateRoomIconById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomIconService.updateRoomIconById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_icons.controller][updateRoomIconById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating room_icon'
        });
    }
};

export const deleteRoomIconById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomIconService.deleteRoomIconById(parseInt(req.params.id));

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_icons.controller][deleteRoomIconById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting room_icon'
        });
    }
};

export const uploadFileToS3 = (file: fileUpload.UploadedFile, fileKey: string) => {
    const KEY_ID = process.env.AWS_KEY_ID;
    const SECRET_KEY = process.env.AWS_SECRET_KEY;
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const fileContent = Buffer.from(file.data);
    const imageRemoteName = fileKey;

    const s3 = new AWS.S3({
        accessKeyId: KEY_ID,
        secretAccessKey: SECRET_KEY,
    });
    return new Promise((resolve, reject) => {
        s3.putObject({
            Bucket: BUCKET_NAME,
            Body: fileContent,
            Key: imageRemoteName,
            ACL: 'public-read',
            ContentType: file.mimetype
        })
            .promise()
            .then(res => {
                console.log(`Upload succeeded - `, res);
                resolve(res)
            })
            .catch(err => {
                console.log("Upload failed:", err);
                reject(err)
            });
    })
} 