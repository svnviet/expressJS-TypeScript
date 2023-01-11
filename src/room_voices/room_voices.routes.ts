import { Router } from 'express';
import {
    getAllRoomVoices,
    getRoomVoiceById,
    createRoomVoice,
    updateRoomVoiceById,
    // createRoomVoiceByRoomId,
    // updateRoomVoiceByRoomId
} from './room_voices.controller';

const router = Router();

router.route('/').get(getAllRoomVoices);
router.route('/:id').get(getRoomVoiceById);
router.route('/').post(createRoomVoice);
router.route('/:id').put(updateRoomVoiceById);
// router.route('/createRoomVoice').post(createRoomVoiceByRoomId);
// router.route('/updateRoomVoice').post(updateRoomVoiceByRoomId);

export default router;