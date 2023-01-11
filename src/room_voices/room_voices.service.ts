import { AppDataSource } from '../data-source';
import { RoomVoice } from './room_voices.model';

const roomVoiceRepository = AppDataSource.getRepository(RoomVoice);

/**
 * get all room_voices
 */
export const getRoomVoices = async () => {
    return roomVoiceRepository.find();
};

/**
 * get room_voice by id
 */
export const getRoomVoiceById = async (id: RoomVoice['id']) => {
    return await roomVoiceRepository.findOneBy({ id: id });
};

/**
 * add new room_voice
 */
export const createRoomVoice = async (input: Partial<RoomVoice>) => {
    return await roomVoiceRepository.insert({
        room_id: input.room_id,
        start_time: new Date(),
        status: input.status,
        user_count1: input.user_count1,
        user_count2: input.user_count2,
        created_at: input.created_at
    });
};

/**
 * update room_voice by id
 */
export const updateRoomVoiceById = async (id: RoomVoice['id'], roomVoices: Partial<RoomVoice>) => {
    const result = await roomVoiceRepository.update(id, {
        user_count1: roomVoices.user_count1,
        user_count2: roomVoices.user_count2,
        updated_at: roomVoices.updated_at
    });
    return result.affected > 0;
};

/**
 * get active room_voice by room_id
 */
export const getActiveRoomVoiceByRoomId = async (room_id: RoomVoice['room_id']) => {
    return await roomVoiceRepository.findOneBy({ room_id: room_id, status: 1 }); // 0:配信前 1:配信中 2:配信終了
};

/**
 * get active room_voice by room_id
 */
export const updateRoomVoiceById_IncreaseUserCount2 = async (id: RoomVoice['id'], new_user_count2: RoomVoice['user_count2']) => {
    const result = await roomVoiceRepository.update(id, {
        user_count2: new_user_count2,
        updated_at: new Date()
    });
    return result.affected > 0;
};

// /**
//  * update room_voice by room id
//  */
// export const updateRoomVoiceByRoomId = async (room_id: RoomVoice['room_id']) => {
//     return roomVoiceRepository.query(`UPDATE room_voices
//     SET end_time = ?, STATUS = 2
//     WHERE room_id =?`, [new Date(), room_id])
// };

/**
 * upsert room_voice status by room id
 */
export const upsertRoomVoiceStatusByUserId = async (id: RoomVoice['id'], roomVoices: Partial<RoomVoice>) => {
    return roomVoiceRepository.query(`UPDATE room_voices
    SET end_time = ?, STATUS = ?, updated_at = ?
    WHERE id =?`, [roomVoices.end_time, roomVoices.status, roomVoices.updated_at, id]);
};