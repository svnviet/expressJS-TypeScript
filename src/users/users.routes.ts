import { Router } from 'express';
import { isAuthenticated } from '../auth/authenticated';
import {
    createUser,
    deleteUserById,
    getUserById,
    getAllUsers,
    getActiveUsersByCompanyId,
    getCompanyIdByUid,
    updateUserById,
    verifyRegisterCode,
    updateMicStatus,
    updateSpeakerStatus,
    changeName,
    changeAvatar,
    changeLoginStatus
} from './users.controller';

const router = Router();

router.route('/').post(createUser);
router.route('/').get([isAuthenticated, getAllUsers]);
router.route('/:id').get([isAuthenticated, getUserById]);
router.route('/active/:company_id').get([isAuthenticated, getActiveUsersByCompanyId]);
router.route('/getCompanyId/:uid').get([isAuthenticated, getCompanyIdByUid]);
router.route('/:id').put([isAuthenticated, updateUserById]);
router.route('/:id').delete([isAuthenticated, deleteUserById]);

router.route('/verifyRegisterCode').post(verifyRegisterCode);
router.route('/updateMicStatus/:uid').post([isAuthenticated, updateMicStatus]);
router.route('/updateSpeakerStatus/:uid').post([isAuthenticated, updateSpeakerStatus]);
router.route('/changeName/:uid').post([isAuthenticated, changeName]);
router.route('/changeAvatar/:uid').post([isAuthenticated, changeAvatar]);
router.route('/changeLoginStatus/:uid').post([isAuthenticated, changeLoginStatus]);

export default router;