import { Request, RequestHandler, Response } from 'express';
import * as UserService from '../users/users.service';
import * as RoomUserService from '../room_users/room_users.service';
import * as RoomVoiceService from './room_voices.service';
import * as RoomVoiceLogService from '../room_voice_logs/room_voice_logs.service';
import * as RoomVoiceAccessLogService from '../room_voice_access_logs/room_voice_access_logs.service';
import { User } from '../users/users.model';
import { RoomVoiceLog } from '../room_voice_logs/room_voice_logs.model';

export const getAllRoomVoices: RequestHandler = async (req: Request, res: Response) => {
    try {
        const roomVoices = await RoomVoiceService.getRoomVoices();

        res.status(200).json({
            roomVoices
        });
    } catch (error) {
        console.error('[room_voices.controller][getAllRoomVoices][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active room_voices'
        });
    }
};

export const getRoomVoiceById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const roomVoices = await RoomVoiceService.getRoomVoiceById(parseInt(req.params.id));

        res.status(200).json({
            roomVoices
        });
    } catch (error) {
        console.error('[room_voices.controller][getRoomVoiceById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching room_voice'
        });
    }
};

export const createRoomVoice: RequestHandler = async (req: Request, res: Response) => {
    try {
        const roomVoices = await RoomVoiceService.createRoomVoice(req.body);

        res.status(200).json({
            roomVoices
        });
    } catch (error) {
        console.error('[room_voices.controller][createRoomVoice][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new room_voice'
        });
    }
};

export const updateRoomVoiceById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomVoiceService.updateRoomVoiceById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_voices.controller][updateRoomVoiceById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating room_voice'
        });
    }
};

export const upsertRoomVoiceByUserUid = async (user_id: User['id'], old_is_mic: User['is_mic']) => {
    try {
        const room_user = await RoomUserService.getCurrentRoomUserByUserId(user_id);
        const room_users = await RoomUserService.getRoomUsersByStatusAndRoomId(1, room_user.room_id);

        let iCountIsMicOn = 0;
        let iCountIsMicOff = 0;

        room_users.forEach(element => {
            // Mic ON
            if (element.user_is_mic == 1) {
                iCountIsMicOn = iCountIsMicOn + 1;
            }
            // Mic OFF
            else {
                iCountIsMicOff = iCountIsMicOff + 1;
            }
        });

        const room_voice = await RoomVoiceService.getActiveRoomVoiceByRoomId(room_user.room_id);

        if (iCountIsMicOn > 0) {
            if (room_voice == null) {
                var roomVoice = await RoomVoiceService.createRoomVoice({
                    room_id: room_user.room_id,
                    status: 1,
                    user_count1: iCountIsMicOn,
                    user_count2: iCountIsMicOff,
                    created_at: new Date()
                });

                let room_voice_id = roomVoice.identifiers[0].id;
                // console.debug('[room_voices.controller][upsertRoomVoiceByUserUid][createRoomVoice][room_voice_id] ', room_voice_id);

                // Create room_voice_access_logs
                room_users.forEach(async element => {
                    await RoomVoiceAccessLogService.createRoomVoiceAccessLog({
                        room_voice_id: room_voice_id,
                        user_id: element.user_id,
                    });
                });

                return roomVoice;
            }
            else {
                const room_voice_log = await RoomVoiceLogService.getRoomVoiceLogByRoomVoiceIdAndUserId(room_voice.id, user_id);

                // Mic OFF -> Mic ON
                // Not join room_voice yet
                if (old_is_mic == 0 && room_voice_log == null && room_voice.user_count2 > 0) {
                    return await RoomVoiceService.updateRoomVoiceById(room_voice.id, {
                        user_count1: room_voice.user_count1 + 1,
                        user_count2: room_voice.user_count2 - 1,
                        updated_at: new Date()
                    });
                }
            }
        }
        else if (iCountIsMicOn == 0 && iCountIsMicOff > 0) {
            if (room_voice != null) {
                return await RoomVoiceService.upsertRoomVoiceStatusByUserId(room_voice.id, {
                    end_time: new Date(),
                    status: 2,
                    updated_at: new Date()
                });
            }
        }
    } catch (error) {
        console.error('[room_voices.controller][upsertRoomVoiceStatusByUserUid][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
    }
};