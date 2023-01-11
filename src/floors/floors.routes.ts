import { Router } from 'express';
import {
    createFloor,
    getAllFloors,
    getFloorById,
    getActiveFloorsByCompanyId,
    updateFloorById,
    deleteFloorById,
} from './floors.controller';

const router = Router();

router.route('/').post(createFloor);
router.route('/').get(getAllFloors);
router.route('/:id').get(getFloorById);
router.route('/active/:company_id').get(getActiveFloorsByCompanyId);
router.route('/:id').put(updateFloorById);
router.route('/:id').delete(deleteFloorById);

export default router;