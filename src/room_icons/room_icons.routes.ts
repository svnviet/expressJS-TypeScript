import { Router } from 'express';
import {
    createRoomIcon,
    getAllRoomIcons,
    getRoomIconById,
    getActiveRoomIconsByCompanyId,
    updateRoomIconById,
    deleteRoomIconById,
} from './room_icons.controller';

const router = Router();

router.route('/').post(createRoomIcon);
router.route('/').get(getAllRoomIcons);
router.route('/:id').get(getRoomIconById);
router.route('/active/:company_id').get(getActiveRoomIconsByCompanyId);
router.route('/:id').put(updateRoomIconById);
router.route('/:id').delete(deleteRoomIconById);

export default router;