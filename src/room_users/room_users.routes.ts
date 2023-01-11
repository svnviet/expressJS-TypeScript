import { Router } from 'express';
import {
    createRoomUser,
    getAllRoomUsers,
    getRoomUserById,
    getActiveRoomUsersByRoomId,
    getActiveRoomUsersByFloorId,
    updateRoomUserById,
    deleteRoomUserById,
    changeRoom,
    leaveRoom
} from './room_users.controller';

const router = Router();

router.route('/').post(createRoomUser);
router.route('/').get(getAllRoomUsers);
router.route('/:id').get(getRoomUserById);
router.route('/active/:room_id').get(getActiveRoomUsersByRoomId);
router.route('/active/floor/:floor_id').get(getActiveRoomUsersByFloorId);
router.route('/:id').put(updateRoomUserById);
router.route('/:id').delete(deleteRoomUserById);
router.route('/changeRoom').post(changeRoom);
router.route('/leaveRoom').post(leaveRoom);

export default router;