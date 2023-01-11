import { Request, RequestHandler, Response } from 'express';
import { User } from '../users/users.model';
import * as RoomUserService from '../room_users/room_users.service';
import * as RoomVoiceService from '../room_voices/room_voices.service';
import * as RoomVoiceLogService from './room_voice_logs.service';
import { RoomVoiceLog } from './room_voice_logs.model';

export const getAllRoomVoiceLogs: RequestHandler = async (req: Request, res: Response) => {
    try {
        const RoomVoiceLogs = await RoomVoiceLogService.getRoomVoiceLogs();

        res.status(200).json({
            RoomVoiceLogs
        });
    } catch (error) {
        console.error('[room_voice_logs.controller][getAllRoomVoiceLogs][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching room_voice_logs'
        });
    }
};

export const getRoomVoiceLogById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const RoomVoiceLogs = await RoomVoiceLogService.getRoomVoiceLogById(parseInt(req.params.id));

        res.status(200).json({
            RoomVoiceLogs
        });
    } catch (error) {
        console.error('[room_voice_logs.controller][getRoomVoiceLogById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching room_voice_log'
        });
    }
};

export const createRoomVoiceLog: RequestHandler = async (req: Request, res: Response) => {
    try {
        const RoomVoiceLogs = await RoomVoiceLogService.createRoomVoiceLog(req.body);

        res.status(200).json({
            RoomVoiceLogs
        });
    } catch (error) {
        console.error('[room_voice_logs.controller][createRoomVoiceLog][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new room_voice_log'
        });
    }
};

export const upsertRoomVoiceLogByUserId = async (user_id: User['id'], old_is_mic: User['is_mic'], old_room_voice_log_id: RoomVoiceLog["id"]) => {
    if (old_is_mic == 1) {
        // console.debug('DEBUG - updateRoomVoiceLogById_MicOff');
        // new_is_mic will be 0 ( ON -> OFF )
        return await RoomVoiceLogService.updateRoomVoiceLogById_MicOff(old_room_voice_log_id);
    }
    // old_is_mic == 0
    else {
        // console.debug('DEBUG - getRoomUserByUserId');
        const room_user = await RoomUserService.getCurrentRoomUserByUserId(user_id);
        if(room_user) {
            let new_room_id = room_user.room_id;

            // console.debug('DEBUG - getActiveRoomVoiceByRoomId');
            const room_voice = await RoomVoiceService.getActiveRoomVoiceByRoomId(new_room_id);
            let new_room_voice_id = room_voice.id;

            // console.debug('DEBUG - createRoomVoiceLog');
            // new_is_mic will be 1 ( OFF -> ON )
            return await RoomVoiceLogService.createRoomVoiceLog({
                room_voice_id: new_room_voice_id,
                user_id: user_id,
                mic: 1,
            });
        }
    }
}