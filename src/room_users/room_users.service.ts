import { IsNull, Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Floor } from '../floors/floors.model';
import { RoomUser } from './room_users.model';

const roomUserRepository = AppDataSource.getRepository(RoomUser);

/**
 * get all room_users
 */
export const getRoomUsers = async () => {
    return roomUserRepository.find();
};

/**
 * get room_user by id
 */
export const getRoomUserById = async (id: RoomUser['id']) => {
    return await roomUserRepository.findOneBy({ id: id });
};

/**
 * get all room_users by status and room_id
 */
export const getRoomUsersByStatusAndRoomId = async (status: RoomUser['status'], room_id: RoomUser['room_id']) => {
    // return await roomUserRepository.findBy({ status: status, room_id: room_id });
    return await roomUserRepository.query(`
    SELECT rooms.id as room_id, rooms.name as room_name,
     users.id as user_id, users.onamae as user_name, users.avatar as user_avatar,
     users.is_mic as user_is_mic, users.is_speaker as user_is_speaker, users.login_status as user_login_status
    FROM room_users
    INNER JOIN rooms ON room_users.room_id = rooms.id
    INNER JOIN users ON room_users.user_id = users.id
    WHERE room_users.status = ? AND room_users.room_id = ? AND room_users.deleted_at IS NULL AND users.deleted_at IS NULL`
        , [status, room_id]);
};

/**
 * get all room_users by floor_id status and room_id
 */
 export const getRoomUsersByFloorIdStatusAndRoomId = async (floor_id: Floor['id']) => {
    return await roomUserRepository.query(`
    SELECT room_users.room_id ,new_rooms.name AS room_name, room_icons.icon_images,
     users.uid , users.id AS user_id, users.onamae AS user_name, users.avatar AS user_avatar, users.custom_status AS user_custom_status,
     users.is_mic AS user_is_mic, users.is_speaker AS user_is_speaker, users.login_status AS user_login_status
    FROM  (SELECT id, name, room_icon_id FROM rooms WHERE floor_id = ? AND status = 1 AND rooms.deleted_at IS NULL) AS new_rooms
    INNER JOIN room_users ON room_users.room_id = new_rooms.id
    INNER JOIN room_icons ON room_icons.id = new_rooms.room_icon_id
    INNER JOIN users ON users.id = room_users.user_id
    WHERE room_users.deleted_at IS NULL AND room_users.status = 1 AND users.deleted_at IS NULL`, [floor_id]);
};
/**
 * add new room_user
 */
export const createRoomUser = async (input: Partial<RoomUser>) => {
    // return await roomUserRepository.save(roomUserRepository.create(input));
    return await roomUserRepository.insert({
        room_id: input.room_id,
        user_id: input.user_id,
        created_at: input.created_at
    });
};

/**
 * update room_user by id
 */
export const updateRoomUserById = async (id: RoomUser['id'], roomUser: RoomUser) => {
    const result = await roomUserRepository.update(id, {
        room_id: roomUser.room_id,
        user_id: roomUser.user_id
    });
    return result.affected > 0;
};

/**
 * update room status by id
 */
export const updateRoomUserStatusById = async (id: RoomUser['id'], status: RoomUser['status']) => {
    const result = await roomUserRepository.update(id, { status: status, updated_at: new Date() });
    return result.affected > 0;
};

/**
 * soft delete room by id
 */
export const deleteRoomUserById = async (id: RoomUser['id']) => {
    const result = await roomUserRepository.softDelete(id);
    return result.affected > 0;
};

/**
 * update room_users - leave room
 */
export const leaveRoom = async (user_id: RoomUser['user_id']) => {
    const result = await roomUserRepository.update({ user_id: user_id, status: 1 }, { status: 2, end_time: new Date() })
    return result.affected > 0;
};

/**
 * update room_users - join room
 */
export const joinRoom = async (room_id: RoomUser['room_id'], user_id: RoomUser['user_id']) => {
    return createRoomUser({
        room_id: room_id,
        user_id: user_id,
        created_at: new Date()
    });
}

/**
 * get room_users by room id
 */
export const getRoomUserByRoomId = async (room_id: RoomUser['room_id']) => {
    return await roomUserRepository.findOneBy({ room_id: room_id });
};

/**
 * get room_users by user id
 */
export const getCurrentRoomUserByUserId = async (user_id: RoomUser['user_id']) => {
    return await roomUserRepository.findOneBy({ user_id: user_id, start_time: Not(IsNull()), end_time: IsNull() });
};

export const joinRoomUsersIsMicOn = async (room_id: RoomUser['room_id']) => {
    return await roomUserRepository.query(`SELECT room_users.id, room_id, user_id, users.is_mic
    FROM room_users
    LEFT JOIN rooms ON room_users.room_id = rooms.id
    LEFT JOIN users ON room_users.user_id = users.id
    WHERE room_users.room_id =? AND users.is_mic = 1`, [room_id])
};

export const joiningRoomUsers = async (room_id: RoomUser['room_id']) => {
    return await roomUserRepository.query(`SELECT *
    FROM room_users
    WHERE room_users.room_id =? AND status = 1`, [room_id])
};