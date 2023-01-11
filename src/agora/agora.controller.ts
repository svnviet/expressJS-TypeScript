import { Request, RequestHandler, Response } from 'express';
import * as AgoraService from './agora.service';

export const generateRTCToken: RequestHandler = async (req: Request, res: Response) => {
    try {
        const channelName = req.params.channel;
        const role = req.params.role;
        const tokentype = req.params.tokentype;
        const uid = req.params.uid;
        const expiry = req.params.expiry;
        const result = await AgoraService.generateRTCToken(res, channelName, role, tokentype, uid, expiry);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[agora.controller][generateRTCToken][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when generateRTCToken'
        });
    }
}

export const generateRTMToken: RequestHandler = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const expiry = req.params.expiry;
        const result = await AgoraService.generateRTMToken(res, uid, expiry);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[agora.controller][generateRTMToken][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when generateRTMToken'
        });
    }
}

export const generateRTEToken: RequestHandler = async (req: Request, res: Response) => {
    try {
        const channelName = req.params.channel;
        const role = req.params.role;
        const tokentype = req.params.tokentype;
        const uid = req.params.uid;
        const expiry = req.params.expiry;
        const result = await AgoraService.generateRTEToken(res, channelName, role, tokentype, uid, expiry);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[agora.controller][generateRTEToken][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when generateRTEToken'
        });
    }
}