import { Request, RequestHandler, Response } from 'express';
import * as UserService from './users.service';
import * as CompanyService from '../companies/companies.service';
import * as RoomVoiceController from '../room_voices/room_voices.controller';
import * as RoomVoiceLogController from '../room_voice_logs/room_voice_logs.controller';
import firebaseAdmin from '../config/firebaseAdmin'

import * as RoomUserService from '../room_users/room_users.service';
import * as RoomVoiceService from '../room_voices/room_voices.service';
import * as RoomVoiceLogService from '../room_voice_logs/room_voice_logs.service';
import fileUpload = require('express-fileupload');
import { uploadFileToS3 } from '../room_icons/room_icons.controller';
import { User } from './users.model';
import { validateSync } from 'class-validator';

var bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const saltRounds = 10;

export const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getUsers();

        res.status(200).json({
            users
        });
    } catch (error) {
        console.error('[users.controller][getAllUsers][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching users'
        });
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(parseInt(req.params.id));

        res.status(200).json({
            "user": user,
            "firebase": (await firebaseAdmin.auth().getUser(user.uid))
        });
    } catch (error) {
        console.error('[users.controller][getUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching user'
        });
    }
};

export const getUserIdByUid: RequestHandler = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(parseInt(req.params.id));

        res.status(200).json({
            user
        });
    } catch (error) {
        console.error('[users.controller][getUserIdByUid][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching user'
        });
    }
};

export const getActiveUsersByCompanyId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getUsersByStatusAndCompanyId(1, parseInt(req.params.company_id));

        res.status(200).json({
            users
        });
    } catch (error) {
        console.error('[users.controller][getActiveUsersByCompanyId][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active users'
        });
    }
};

export const getCompanyIdByUid: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getCompanyIdByUid(req.params.uid);

        res.status(200).json({
            users
        });
    } catch (error) {
        console.error('[users.controller][getCompanyIdByUid][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching user'
        });
    }
};

export const createUser: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.body.company_code) {
        return res.status(400).send({ message: 'Company_code is empty' });
    }

    if (!req.body.email) {
        return res.status(400).send({ message: 'Email is empty' });
    }

    if (!req.body.password) {
        return res.status(400).send({ message: 'Password is empty' });
    }

    if (!req.body.onamae) {
        return res.status(400).send({ error: true, message: 'Onamae is empty' });
    }

    const user = new User();
    user.setValues(req.body);
    const errors = validateSync(user);
    if (errors.length > 0) {
        return res.status(400).send({ message: errors[0].constraints.maxLength });
    } else {
        try {
            const company = await CompanyService.getCompanyByCompanyCode(req.body.company_code);
            // console.log("[users.controller][createUser][getCompanyByCompanyCode] :", company);

            if (company == null) {
                res.status(400).send({ error: true, message: 'Invalid Company Code' });
            } else {
                if (company.status != 1) {
                    res.status(400).send({ error: true, message: 'Invalid Company Status' });
                } else {
                    if (!emailRegexp.test(req.body.email)) {
                        res.status(400).send({ error: true, message: 'Invalid Email Format' });
                    } else {
                        const user = await UserService.getUserByEmail(req.body.email);
                        // console.log("[users.controller][createUser][getUserByEmail] :", user);

                        if (user != null) {
                            res.status(400).send({ error: true, message: 'Email already exists' });
                        } else {
                            req.body.company_id = company.id;
                            req.body.code = Math.floor(Math.random() * 90000) + 10000;

                            bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
                                bcrypt.hash(req.body.password, salt, async function (err: any, hash: any) {
                                    // firebase
                                    await firebaseAdmin.auth().createUser({
                                        password: req.body.password,
                                        email: req.body.email,
                                        disabled: true
                                    })
                                        .then(async (userCredential) => {
                                            // console.error('[users.controller][createUser][firebase][createUserWithEmailAndPassword][Success] ', typeof userCredential === 'object' ? JSON.stringify(userCredential) : userCredential);
                                            req.body.uid = userCredential.uid
                                            req.body.password = hash;
                                            const result = await UserService.createUser(req.body);
                                            sendMail(req.body.email, req.body.code);

                                            res.status(200).json({
                                                "company_id": company.id,
                                                "id": result.identifiers[0].id,
                                                "uid": userCredential.uid
                                            });
                                        })
                                        .catch((error) => {
                                            console.error('[users.controller][createUser][firebase][createUserWithEmailAndPassword][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
                                            res.status(500).json({
                                                message: 'There was an error when firebase-createUserWithEmailAndPassword'
                                            });
                                        });
                                });
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[users.controller][createUser][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
            res.status(500).json({
                message: 'There was an error when adding new user'
            });
        }
    }
};

export const updateUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await UserService.updateUserById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[users.controller][updateUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating user'
        });
    }
};

export const deleteUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await UserService.deleteUserById(parseInt(req.params.id));

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[users.controller][deleteUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting user'
        });
    }
};

export const verifyRegisterCode: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.body.user_id) {
        return res.status(400).send({ message: 'User_id is empty' });
    }

    if (!req.body.code) {
        return res.status(400).send({ message: 'Code is empty' });
    }

    const user = new User();
    user.setValues(req.body);
    const errors = validateSync(user);
    if (errors.length > 0) {
        return res.status(400).send({ message: errors[0].constraints.maxLength });
    } else {
        try {
            const user = await UserService.getUserById(req.body.user_id);
            if (user == null) {
                res.status(400).send({ message: 'Invalid User Id' });
            } else {
                if (user.code == req.body.code) {
                    try {
                        await UserService.updateUserStatusById(req.body.user_id, 1);

                        // firebase
                        firebaseAdmin.auth()
                            .updateUser(user.uid, {
                                emailVerified: true,
                                disabled: false
                            })
                            .then((userRecord) => {
                                console.log('[users.controller][verifyRegisterCode][firebase] Successfully updated emailVerified status', userRecord.toJSON());
                            })
                            .catch((error) => {
                                console.log('Error updating user:', error);
                            });
                    } catch (error) {
                        console.error('[users.controller][verifyRegisterCode][updateUserStatusById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
                        res.status(500).json({
                            message: 'There was an error when updating user status'
                        });
                    }
                    res.status(200).send({ message: 'Authentication successful' });
                }
                else {
                    res.status(400).send({ message: 'Invalid Code' });
                }
            }
        } catch (error) {
            console.error('[users.controller][verifyRegisterCode][getUserById][Error]', typeof error === 'object' ? JSON.stringify(error) : error);
            res.status(500).json({
                message: 'There was an error when fetching user'
            });
        }
    }
};

function sendMail(email: string, code: string) {
    // const smtpEndpoint = process.env.SES_AWS_SMTP_ENDPOINT;
    // const port = process.env.SES_AWS_SMTP_PORT;
    // const senderAddress = process.env.SES_AWS_SMTP_SENDER;
    // const toAddresses = email;
    // const smtpUsername = process.env.SES_AWS_SMTP_USERNAME;
    // const smtpPassword = process.env.SES_AWS_SMTP_PASSWORD;

    // async function main() {
    //     const transporter = nodemailer.createTransport({
    //         host: smtpEndpoint,
    //         port: port,
    //         auth: {
    //             user: smtpUsername,
    //             pass: smtpPassword
    //         }
    //     });

    //     let mailOptions = {
    //         from: senderAddress,
    //         to: toAddresses,
    //         subject: '認証コード',
    //         text: ``,
    //         html: `アプリに認証コードを登録して下さい。</br>認証コードは、</br>${code}</br>です。`,
    //     };

    //     const info = await transporter.sendMail(mailOptions);

    //     console.log("Message sent! Message ID: ", info);
    // }

    // main().catch(console.error);

    // Config in https://sendgrid.com/
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: email, // Change to your recipient
        from: process.env.SENDGRID_FROM,
        subject: '認証コード',
        text: `Your Code ${code}`,
        html: `アプリに認証コードを登録して下さい。</br>認証コードは、</br>${code}</br>です。`,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

export const updateMicStatus: RequestHandler = async (req: Request, res: Response) => {
    try {
        let old_room_id = 0;
        let old_room_voice_id = 0;
        let old_room_voice_log_id = 0;

        const user = await UserService.getUserByUid(req.params.uid);

        // console.debug('DEBUG - getRoomUserByUserId');
        const room_user = await RoomUserService.getCurrentRoomUserByUserId(user.id);
        if (room_user != null) {
            old_room_id = room_user.room_id;
        }

        if (old_room_id != 0) {
            // console.debug('DEBUG - getActiveRoomVoiceByRoomId');
            const room_voice = await RoomVoiceService.getActiveRoomVoiceByRoomId(old_room_id);

            if (room_voice != null) {
                old_room_voice_id = room_voice.id;
            }
        }

        if (old_room_voice_id != 0) {
            // console.debug('DEBUG - getRoomVoiceLogByRoomVoiceIdAndUserId');
            const room_voice_log = await RoomVoiceLogService.getRoomVoiceLogByRoomVoiceIdAndUserId_NotEnd(old_room_voice_id, user.id);

            if (room_voice_log != null) {
                old_room_voice_log_id = room_voice_log.id;
            }
        }

        let old_is_mic = user.is_mic;

        // console.debug('DEBUG - reverseMicStatus');
        // Update users.is_mic
        // ON  -> OFF
        // OFF -> ON
        await UserService.reverseMicStatus(req.params.uid);

        // console.debug('DEBUG - getUserMicStatusByUid');
        // Get new users.is_mic
        const new_is_mic = await UserService.getUserMicStatusByUid(req.params.uid);

        // console.debug('DEBUG - upsertRoomVoiceByUserUid');
        // room_voices
        await RoomVoiceController.upsertRoomVoiceByUserUid(user.id, old_is_mic);

        // console.debug('DEBUG - upsertRoomVoiceLogByUserId');
        // room_voice_logs
        await RoomVoiceLogController.upsertRoomVoiceLogByUserId(user.id, old_is_mic, old_room_voice_log_id);

        res.status(200).json({
            result: new_is_mic
        });
    } catch (error) {
        console.error('[users.controller][updateMicStatus][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating user\'s is_mic'
        });
    }
}

export const updateSpeakerStatus: RequestHandler = async (req: Request, res: Response) => {
    try {
        await UserService.reverseSpeakerStatus(req.params.uid);
        const result = await UserService.getUserSpeakerStatusByUid(req.params.uid);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[users.controller][updateSpeakerStatus][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating user\'s is_speaker'
        });
    }
}

export const changeName: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.body.onamae) {
        return res.status(400).send({ error: true, message: 'Onamae is empty' });
    }

    const user = new User();
    user.setValues(req.body);
    const errors = validateSync(user)
    if (errors.length > 0) {
        return res.status(400).send({ message: errors[0].constraints.maxLength });
    } else {
        try {
            const result = await UserService.updateUserOnamaeByUid(req.params.uid, req.body);

            res.status(200).json({
                result
            });
        } catch (error) {
            console.error('[users.controller][changeName][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
            res.status(500).json({
                message: 'There was an error when updating user\'s onamae'
            });
        }
    }
}

export const changeAvatar: RequestHandler = async (req: Request, res: Response) => {
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

    const user = new User();
    req.body.avatar = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    user.setValues(req.body);
    const errors = validateSync(user)
    if (errors.length > 0) {
        return res.status(400).send({ message: errors[0].constraints.maxLength });
    } else {
        uploadFileToS3(file, fileKey).then(
            async (e) => {
                try {
                    await UserService.updateUserAvatarByUid(req.params.uid, req.body);

                    res.status(200).json({
                        "avatar": req.body.avatar
                    });
                } catch (error) {
                    console.error('[users.controller][changeAvatar][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
                    res.status(500).json({
                        message: 'There was an error when updating user\'s avatar'
                    });
                }
            }
        ).catch((error) => {
            return res.status(400).send({ error: true, message: 'Image Upload faild: ' + error.message });
        })
    }
}

export const changeLoginStatus: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.body.login_status && req.body.login_status < 0 && req.body.login_status > 5) {
        return res.status(400).send({ error: true, message: 'Invalid login_status' });
    }

    try {
        const result = await UserService.updateUserLoginStatusByUid(req.params.uid, req.body.custom_status,req.body);
        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[users.controller][changeLoginStatus][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating user\'s login_status'
        });
    }
};