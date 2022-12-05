import { AppDataSource } from '../data-source';
import { Room } from './rooms.model';

const roomRepository = AppDataSource.getRepository(Room);

/**
 * get all rooms
 */
export const getRooms = async () => {
    return roomRepository.find();
};

/**
 * get room by id
 */
export const getRoomById = async (id: Room['id']) => {
    return await roomRepository.findOneBy({ id: id });
};

/**
 * get all rooms by status and floor id
 */
export const getRoomsByStatusAndFloorId = async (status: Room['status'], floor_id: Room['floor_id']) => {
    // return await (await roomRepository.findBy({ status: status, floor_id: floor_id })).sort((a, b) => b.view_no - a.view_no);
    return await roomRepository.query(`
    SELECT rooms.floor_id, rooms.id as room_id, rooms.name as room_name, room_icons.icon_images
    FROM rooms
    LEFT JOIN room_icons ON room_icons.id = rooms.room_icon_id
    WHERE rooms.status = ? AND rooms.floor_id = ?
    ORDER BY rooms.view_no DESC`
        , [status, floor_id]);
};

/**
 * add new room
 */
export const createRoom = async (input: Partial<Room>) => {
    // return await roomRepository.save(roomRepository.create(input));
    return await roomRepository.insert({
        floor_id: input.floor_id,
        name: input.name,
        room_icon_id: input.room_icon_id,
        created_user: input.created_user,
    });
};

/**
 * update room by id
 */
export const updateRoomById = async (id: Room['id'], room: Room) => {
    const result = await roomRepository.update(id, {
        floor_id: room.floor_id,
        status: room.status,
        name: room.name,
        room_icon_id: room.room_icon_id,
        view_no: room.view_no,
        updated_user: room.updated_user
    });
    return result.affected > 0;
};

/**
 * update room status by id
 */
export const updateRoomStatusById = async (id: Room['id'], status: Room['status']) => {
    const result = await roomRepository.update(id, { status: status, updated_at: new Date() });
    return result.affected > 0;
};

/**
 * soft delete room by id
 */
export const deleteRoomById = async (id: Room['id']) => {
    const result = await roomRepository.softDelete(id);
    return result.affected > 0;
};