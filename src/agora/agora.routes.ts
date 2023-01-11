import { Router } from 'express';
import {
    generateRTCToken,
    generateRTMToken,
    generateRTEToken,
} from './agora.controller';

const router = Router();

router.route('/rtc/:channel/:role/:tokentype/:uid').get(generateRTCToken);
router.route('/rtm/:uid/').get(generateRTMToken);
router.route('/rte/:channel/:role/:tokentype/:uid').get(generateRTEToken);

export default router;