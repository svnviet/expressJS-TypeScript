import { AppDataSource } from '../data-source';
import { Floor } from './floors.model';

const floorRepository = AppDataSource.getRepository(Floor);

/**
 * get all floors
 */
export const getFloors = async () => {
    return floorRepository.find();
};

/**
 * get floor by id
 */
export const getFloorById = async (id: Floor['id']) => {
    return await floorRepository.findOneBy({ id: id });
};

/**
 * get all floors by status and company_id
 */
export const getFloorsByStatusAndCompanyId = async (status: Floor['status'], company_id: Floor['company_id']) => {
    return await (await floorRepository.findBy({ status: status, company_id: company_id })).sort((a, b) => b.view_no - a.view_no);
};

/**
 * add new floor
 */
export const createFloor = async (input: Partial<Floor>) => {
    // return await companyRepository.save(companyRepository.create(input));
    return await floorRepository.insert({
        company_id: input.company_id,
        name: input.name,
        created_user: input.created_user,
    });
};

/**
 * update floor by id
 */
export const updateFloorById = async (id: Floor['id'], floor: Floor) => {
    const result = await floorRepository.update(id, {
        company_id: floor.company_id,
        status: floor.status,
        name: floor.name,
        view_no: floor.view_no,
        updated_user: floor.updated_user
    });
    return result.affected > 0;
};

/**
 * update floor status by id
 */
export const updateFloorStatusById = async (id: Floor['id'], status: Floor['status']) => {
    const result = await floorRepository.update(id, { status: status, updated_at: new Date() });
    return result.affected > 0;
};

/**
 * soft delete floor by id
 */
export const deleteFloorById = async (id: Floor['id']) => {
    const result = await floorRepository.softDelete(id);
    return result.affected > 0;
};

/**
 * soft delete floor status by id
 */
 export const deleteFloorStatusById = async (id: Floor['id']) => {
    const result = await floorRepository.update(id, { status: 9, updated_at: new Date() });
    return result.affected > 0;
};