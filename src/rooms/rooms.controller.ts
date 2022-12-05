import { Request, RequestHandler, Response } from 'express';
import * as RoomService from './rooms.service';

export const getAllRooms: RequestHandler = async (req: Request, res: Response) => {
    try {
        const rooms = await RoomService.getRooms();

        res.status(200).json({
            rooms
        });
    } catch (error) {
        console.error('[rooms.controller][getAllRooms][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active rooms'
        });
    }
};

export const getRoomById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const floor = await RoomService.getRoomById(parseInt(req.params.id));

        res.status(200).json({
            floor
        });
    } catch (error) {
        console.error('[rooms.controller][getRoomById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching floor'
        });
    }
};

export const getActiveRoomsByFloorId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const rooms = await RoomService.getRoomsByStatusAndFloorId(1, parseInt(req.params.floor_id));

        res.status(200).json({
            rooms
        });
    } catch (error) {
        console.error('[rooms.controller][getActiveRoomsByFloorId][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active rooms'
        });
    }
};

export const createRoom: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomService.createRoom(req.body);

        res.status(200).json({
            "room_id" : result.identifiers[0].id,
            "room_icon_id" : req.body.room_icon_id,
            "room_name": req.body.name
        });
    } catch (error) {
        console.error('[rooms.controller][createRoom][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new floor'
        });
    }
};

export const updateRoomById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomService.updateRoomById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[rooms.controller][updateRoomById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating floor'
        });
    }
};

export const deleteRoomById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await RoomService.deleteRoomById(parseInt(req.params.id));

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[rooms.controller][deleteRoomById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting floor'
        });
    }
};