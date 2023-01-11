import { Router } from 'express';
import {
    getAllRoomVoiceLogs,
    getRoomVoiceLogById,
    createRoomVoiceLog,
} from './room_voice_logs.controller';

const router = Router();

router.route('/').get(getAllRoomVoiceLogs);
router.route('/:id').get(getRoomVoiceLogById);
router.route('/').post(createRoomVoiceLog);

export default router;