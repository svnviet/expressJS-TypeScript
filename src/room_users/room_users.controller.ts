import { Request, RequestHandler, Response } from 'express';
import * as RoomUsersService from './room_users.service';
import * as UsersService from '../users/users.service';
import * as RoomsService from '../rooms/rooms.service';
import * as RoomVoiceService from '../room_voices/room_voices.service';
import * as RoomVoiceLogService from '../room_voice_logs/room_voice_logs.service';
import * as RoomVoiceAccessLogService from '../room_voice_access_logs/room_voice_access_logs.service';
import * as AgoraService from '../agora/agora.service';

export const getAllRoomUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const room_users = await RoomUsersService.getRoomUsers();

        res.status(200).json({
            room_users
        });
    } catch (error) {
        console.error('[room_users.controller][getAllRoomUsers][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active room_users'
        });
    }
};

export const getRoomUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const room_user = await RoomUsersService.getRoomUserById(parseInt(req.params.id));

        res.status(200).json({
            room_user
        });
    } catch (error) {
        console.error('[room_users.controller][getRoomUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching room_user'
        });
    }
};

export const getActiveRoomUsersByRoomId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const room_users = await RoomUsersService.getRoomUsersByStatusAndRoomId(1, parseInt(req.params.room_id));

        res.status(200).json({
            room_users
        });
    } catch (error) {
        console.error('[room_users.controller][getActiveRoomUsersByRoomId][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active room_users'
        });
    }
};

export const getActiveRoomUsersByFloorId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const room_users = await RoomUsersService.getRoomUsersByFloorIdStatusAndRoomId(parseInt(req.params.floor_id));

        res.status(200).json({
            room_users
        });
    } catch (error) {
        console.error('[room_users.controller][getActiveRoomUsersByFloorId][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active room_users'
        });
    }
};

export const createRoomUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomUsersService.createRoomUser(req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_users.controller][createRoomUser][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new room_user'
        });
    }
};

export const updateRoomUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomUsersService.updateRoomUserById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_users.controller][updateRoomUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating room_user'
        });
    }
};

export const deleteRoomUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomUsersService.deleteRoomUserById(parseInt(req.params.id));

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_users.controller][deleteRoomUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting room_user'
        });
    }
};

export const changeRoom: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.body.uid) {
        return res.status(400).send({ error: true, message: 'Uid is empty' });
    }

    if (!req.body.room_id) {
        return res.status(400).send({ error: true, message: 'room_id is empty' });
    }

    try {
        const user = await UsersService.getUserByUid(req.body.uid);
        if (user == null) {
            return res.status(400).send({ error: true, message: 'Invalid uid' });
        }

        const new_room_id = req.body.room_id;

        const room = await RoomsService.getRoomById(new_room_id);
        if (room == null) {
            return res.status(400).send({ error: true, message: 'Invalid room_id' });
        }

        const user_id = user.id;

        await RoomUsersService.leaveRoom(user_id);
        await RoomUsersService.joinRoom(new_room_id, user_id);

        // console.debug('DEBUG - setMicStatusOff');
        // users.is_mic and users.is_speaker will always be OFF when join to a new room
        // await UsersService.setMicStatusOff(req.body.uid);
        // await UsersService.setSpeakerStatusOff(req.body.uid);

        // console.debug('DEBUG - updateRoomVoiceLogByUserId_MicOff');
        // Update old room_voice_log if exist
        await RoomVoiceLogService.updateRoomVoiceLogByUserId_MicOff(user_id);

        // console.debug('DEBUG - getActiveRoomVoiceByRoomId');
        // Check & update room_voices.user_count2 of new room
        const room_voice = await RoomVoiceService.getActiveRoomVoiceByRoomId(new_room_id);

        if (room_voice != null) {
            // console.debug('DEBUG - getRoomVoiceLogByRoomVoiceIdAndUserId');
            // room_voice != null : room_voice is happening in the new room
            const room_voice_log = await RoomVoiceLogService.getRoomVoiceLogByRoomVoiceIdAndUserId_NotEnd(room_voice.id, user.id);

            const room_voice_access_log = await RoomVoiceAccessLogService.getRoomVoiceAccessLogByRoomVoiceIdAndUserId(room_voice.id, user.id);

            if (room_voice_access_log == null) {
                await RoomVoiceAccessLogService.createRoomVoiceAccessLog({
                    room_voice_id: room_voice.id,
                    user_id: user.id
                });

                if (room_voice_log == null) {
                    // console.debug('DEBUG - updateRoomVoiceById_IncreaseUserCount2');
                    // room_voice_log == null : User is not join current room_voice yet, so log is not exist, then increase room_voice.user_count2's value
                    await RoomVoiceService.updateRoomVoiceById_IncreaseUserCount2(room_voice.id, room_voice.user_count2 + 1);
                }
            }
        }

        const channelName = user.company_id + '_' + room.floor_id + '_' + new_room_id;
        const role = 'publisher';
        const tokenType = 'uid';
        const uid = '0'; // user_id.toString();
        const expiry = '86400'; // seconds = 1 day
        const result = await AgoraService.generateRTCToken(res, channelName, role, tokenType, uid, expiry);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_users.controller][changeRoom][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating room_user (change Room)'
        });
    }
};

export const leaveRoom: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.body.uid) {
        return res.status(400).send({ error: true, message: 'Uid is empty' });
    }

    try {
        const user = await UsersService.getUserByUid(req.body.uid);
        if (user == null) {
            return res.status(400).send({ error: true, message: 'Invalid uid' });
        }

        const user_id = user.id;
        const result = await RoomUsersService.leaveRoom(user_id);

        await UsersService.setMicStatusOff(req.body.uid);
        await UsersService.setSpeakerStatusOff(req.body.uid);

        await RoomVoiceLogService.updateRoomVoiceLogByUserId_MicOff(user_id);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[room_users.controller][leaveRoom][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating room_user (leave Room)'
        });
    }
}