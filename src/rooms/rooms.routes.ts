import { Router } from 'express';
import {
    createRoom,
    getAllRooms,
    getRoomById,
    getActiveRoomsByFloorId,
    updateRoomById,
    deleteRoomById
} from './rooms.controller';

const router = Router();

router.route('/').post(createRoom);
router.route('/').get(getAllRooms);
router.route('/:id').get(getRoomById);
router.route('/active/:floor_id').get(getActiveRoomsByFloorId);
router.route('/:id').put(updateRoomById);
router.route('/:id').delete(deleteRoomById);

export default router;