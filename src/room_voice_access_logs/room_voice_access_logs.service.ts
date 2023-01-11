import { AppDataSource } from '../data-source';
import { RoomVoiceAccessLog } from './room_voice_access_logs.model';

const roomVoiceAccessLogRepository = AppDataSource.getRepository(RoomVoiceAccessLog);

/**
 * get all room_voice_access_logs
 */
export const getRoomVoiceAccessLogs = async () => {
    return roomVoiceAccessLogRepository.find();
};

/**
 * get room_voice_log by id
 */
export const getRoomVoiceAccessLogById = async (id: RoomVoiceAccessLog['id']) => {
    return await roomVoiceAccessLogRepository.findOneBy({ id: id });
};

/**
 * get active room_voice_log by room_voice_id and user_id
 */
export const getRoomVoiceAccessLogByRoomVoiceIdAndUserId = async (room_voice_id: RoomVoiceAccessLog['room_voice_id'], user_id: RoomVoiceAccessLog["user_id"]) => {
    return await roomVoiceAccessLogRepository.findOneBy({ room_voice_id: room_voice_id, user_id: user_id });
};

/**
 * add new room_voice_log
 */
export const createRoomVoiceAccessLog = async (input: Partial<RoomVoiceAccessLog>) => {
    return await roomVoiceAccessLogRepository.insert({
        room_voice_id: input.room_voice_id,
        user_id: input.user_id,
        created_at: new Date()
    });
};