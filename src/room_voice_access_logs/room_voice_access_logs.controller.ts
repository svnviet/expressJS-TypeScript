import { Request, RequestHandler, Response } from 'express';
import * as RoomVoiceAccessLogService from './room_voice_access_logs.service';

export const getAllRoomVoiceAccessLogs: RequestHandler = async (req: Request, res: Response) => {
    try {
        const RoomVoiceAccessLogs = await RoomVoiceAccessLogService.getRoomVoiceAccessLogs();

        res.status(200).json({
            RoomVoiceAccessLogs
        });
    } catch (error) {
        console.error('[room_voice_access_logs.controller][getAllRoomVoiceAccessLogs][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching room_voice_access_logs'
        });
    }
};

export const getRoomVoiceAccessLogById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const RoomVoiceAccessLogs = await RoomVoiceAccessLogService.getRoomVoiceAccessLogById(parseInt(req.params.id));

        res.status(200).json({
            RoomVoiceAccessLogs
        });
    } catch (error) {
        console.error('[room_voice_access_logs.controller][getRoomVoiceAccessLogById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching room_voice_log'
        });
    }
};

export const createRoomVoiceAccessLog: RequestHandler = async (req: Request, res: Response) => {
    try {
        const RoomVoiceAccessLogs = await RoomVoiceAccessLogService.createRoomVoiceAccessLog(req.body);

        res.status(200).json({
            RoomVoiceAccessLogs
        });
    } catch (error) {
        console.error('[room_voice_access_logs.controller][createRoomVoiceAccessLog][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new room_voice_log'
        });
    }
};