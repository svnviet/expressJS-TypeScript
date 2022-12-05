import { Router } from 'express';
import UsersRoutes from '../users/users.routes';
import CompaniesRoutes from '../companies/companies.routes';

const router = Router();

router.use('/users', UsersRoutes);
router.use('/companies', CompaniesRoutes);

export default router;
