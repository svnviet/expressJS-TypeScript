import { Router } from 'express';
import {
    createUser,
    deleteUserById,
    getUserById,
    getAllUsers,
    updateUserById,
    verifyRegisterCode
} from './users.controller';

const router = Router();

router.route('/').post(createUser);
router.route('/').get(getAllUsers);
router.route('/:id').get(getUserById);
router.route('/:id').put(updateUserById);
router.route('/:id').delete(deleteUserById);

router.route('/verifyRegisterCode').post(verifyRegisterCode);

export default router;