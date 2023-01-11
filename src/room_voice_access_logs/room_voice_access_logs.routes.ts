import { Router } from 'express';
import {
    getAllRoomVoiceAccessLogs,
    getRoomVoiceAccessLogById,
    createRoomVoiceAccessLog,
} from './room_voice_access_logs.controller';

const router = Router();

router.route('/').get(getAllRoomVoiceAccessLogs);
router.route('/:id').get(getRoomVoiceAccessLogById);
router.route('/').post(createRoomVoiceAccessLog);

export default router;