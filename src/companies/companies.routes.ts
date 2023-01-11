import { Router } from 'express';
import {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompanyById,
    deleteCompanyById,
} from './companies.controller';

const router = Router();

router.route('/').post(createCompany);
router.route('/').get(getAllCompanies);
router.route('/:id').get(getCompanyById);
router.route('/:id').put(updateCompanyById);
router.route('/:id').delete(deleteCompanyById);

export default router;