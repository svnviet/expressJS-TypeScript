import { Router } from 'express';
import { isAuthenticated } from './auth/authenticated';
import UsersRoutes from './users/users.routes';
import CompaniesRoutes from './companies/companies.routes';
import FloorsRoutes from './floors/floors.routes';
import RoomsRoutes from './rooms/rooms.routes';
import RoomUsersRoutes from './room_users/room_users.routes';
import RoomIconsRoutes from './room_icons/room_icons.routes';

const router = Router();

router.use('/users', [isAuthenticated, UsersRoutes]);
router.use('/rooms', [isAuthenticated, RoomsRoutes]);

export default router;
