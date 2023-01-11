import { IsNull, Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import { RoomVoice } from '../room_voices/room_voices.model';
import { User } from '../users/users.model';
import { RoomVoiceLog } from './room_voice_logs.model';

const roomVoiceLogRepository = AppDataSource.getRepository(RoomVoiceLog);

/**
 * get all room_voice_logs
 */
export const getRoomVoiceLogs = async () => {
    return roomVoiceLogRepository.find();
};

/**
 * get room_voice_log by id
 */
export const getRoomVoiceLogById = async (id: RoomVoiceLog['id']) => {
    return await roomVoiceLogRepository.findOneBy({ id: id });
};

/**
 * get active room_voice_log by room_voice_id and user_id ( mic on and not off yet )
 */
export const getRoomVoiceLogByRoomVoiceIdAndUserId_NotEnd = async (room_voice_id: RoomVoiceLog['room_voice_id'], user_id: RoomVoiceLog["user_id"]) => {
    return await roomVoiceLogRepository.findOneBy({ room_voice_id: room_voice_id, user_id: user_id, start_time: Not(IsNull()), end_time: IsNull() });
};


/**
 * get active room_voice_log by room_voice_id and user_id ( mic on and dont care about mic off )
 */
export const getRoomVoiceLogByRoomVoiceIdAndUserId = async (room_voice_id: RoomVoiceLog['room_voice_id'], user_id: RoomVoiceLog["user_id"]) => {
    return await roomVoiceLogRepository.findOneBy({ room_voice_id: room_voice_id, user_id: user_id });
};

/**
 * add new room_voice_log
 */
export const createRoomVoiceLog = async (input: Partial<RoomVoiceLog>) => {
    return await roomVoiceLogRepository.insert({
        room_voice_id: input.room_voice_id,
        user_id: input.user_id,
        mic: input.mic,
        start_time: new Date(),
        created_at: new Date()
    });
};

/**
 * update room_voice_log by id
 */
export const updateRoomVoiceLogById_MicOff = async (id: RoomVoiceLog['id']) => {
    const result = await roomVoiceLogRepository.update(id, {
        mic: 2,
        end_time: new Date(),
        updated_at: new Date()
    });
    return result.affected > 0;
};

/**
 * update room_voice_log by user_id
 */
export const updateRoomVoiceLogByUserId_MicOff = async (user_id: RoomVoiceLog['user_id']) => {
    return roomVoiceLogRepository.query(`UPDATE room_voice_logs
    SET mic = ?, end_time = ?, updated_at = ?
    WHERE user_id =? AND start_time is not null AND end_time is null`, [2, new Date(), new Date(), user_id]);
};