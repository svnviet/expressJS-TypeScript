import { AppDataSource } from '../data-source';
import { RoomIcon } from './room_icons.model';

const roomIconRepository = AppDataSource.getRepository(RoomIcon);

/**
 * get all room_icons
 */
export const getRoomIcons = async () => {
    return roomIconRepository.find();
};

/**
 * get room_icon by id
 */
export const getRoomIconById = async (id: RoomIcon['id']) => {
    return await roomIconRepository.findOneBy({ id: id });
};

/**
 * get all room_icons by status and company_id
 */
export const getRoomIconsByStatusAndCompanyId = async (status: RoomIcon['status'], company_id: RoomIcon['company_id']) => {
    // return await roomIconRepository.findBy({ status: status, company_id: company_id });
    return await roomIconRepository.query(`
    SELECT id, icon_images
    FROM room_icons
    WHERE status = ? AND company_id = ? AND room_icons.deleted_at IS NULL
    ORDER BY created_at DESC`
        , [status, company_id]);
};

/**
 * add new room_icon
 */
export const createRoomIcon = async (input: Partial<RoomIcon>) => {
    return await roomIconRepository.insert({
        company_id: input.company_id,
        icon_images: input.icon_images,
    });
};

/**
 * update room_icon by id
 */
export const updateRoomIconById = async (id: RoomIcon['id'], room_icon: RoomIcon) => {
    const result = await roomIconRepository.update(id, {
        company_id: room_icon.company_id,
        status: room_icon.status,
    });
    return result.affected > 0;
};

/**
 * update room_icon status by id
 */
export const updateRoomIconStatusById = async (id: RoomIcon['id'], status: RoomIcon['status']) => {
    const result = await roomIconRepository.update(id, { status: status, updated_at: new Date() });
    return result.affected > 0;
};

/**
 * soft delete room_icon by id
 */
export const deleteRoomIconById = async (id: RoomIcon['id']) => {
    const result = await roomIconRepository.softDelete(id);
    return result.affected > 0;
};