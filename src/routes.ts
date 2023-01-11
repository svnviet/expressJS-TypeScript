import { Router } from 'express';
import { isAuthenticated } from './auth/authenticated';
import UsersRoutes from './users/users.routes';
import CompaniesRoutes from './companies/companies.routes';
import FloorsRoutes from './floors/floors.routes';
import RoomsRoutes from './rooms/rooms.routes';
import RoomUsersRoutes from './room_users/room_users.routes';
import RoomIconsRoutes from './room_icons/room_icons.routes';
import RoomVoicesRoutes from './room_voices/room_voices.routes';
import AgoraRoutes from './agora/agora.routes';

const router = Router();

router.use('/users', UsersRoutes);
router.use('/companies', [isAuthenticated, CompaniesRoutes]);
router.use('/floors', [isAuthenticated, FloorsRoutes]);
router.use('/rooms', [isAuthenticated, RoomsRoutes]);
router.use('/room_users', [isAuthenticated, RoomUsersRoutes]);
router.use('/room_icons', [isAuthenticated, RoomIconsRoutes]);
router.use('/room_voices', [isAuthenticated, RoomVoicesRoutes]);

router.use('/agora', [isAuthenticated, AgoraRoutes]);

export default router;