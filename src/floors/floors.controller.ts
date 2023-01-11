import { Request, RequestHandler, Response } from 'express';
import { Floor } from './floors.model';
import * as FloorService from './floors.service';
import { validateSync } from 'class-validator';

export const getAllFloors: RequestHandler = async (req: Request, res: Response) => {
    try {
        const floors = await FloorService.getFloors();

        res.status(200).json({
            floors
        });
    } catch (error) {
        console.error('[floors.controller][getAllFloors][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active floors'
        });
    }
};

export const getFloorById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const floor = await FloorService.getFloorById(parseInt(req.params.id));

        res.status(200).json({
            floor
        });
    } catch (error) {
        console.error('[floors.controller][getFloorById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching floor'
        });
    }
};

export const getActiveFloorsByCompanyId: RequestHandler = async (req: Request, res: Response) => {
    try {
        const floors = await FloorService.getFloorsByStatusAndCompanyId(1, parseInt(req.params.company_id));

        res.status(200).json({
            floors
        });
    } catch (error) {
        console.error('[floors.controller][getActiveFloorsByCompanyId][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching active floors'
        });
    }
};

export const createFloor: RequestHandler = async (req: Request, res: Response) => {
    //validate request
    if (!req.body.company_id) {
        return res.status(400).send({ error: true, message: 'Company_id is empty' });
    }

    if (!req.body.name) {
        return res.status(400).send({ error: true, message: 'Name is empty' });
    }

    if (!req.body.created_user) {
        return res.status(400).send({ error: true, message: 'Created_user is empty' });
    }

    const floor = new Floor();
    floor.name = req.body.name;
    const errors = validateSync(floor);
    if (errors.length > 0) {
        return res.status(400).send({ message: errors[0].constraints.maxLength });
    } else {
        try {
            const result = await FloorService.createFloor(req.body);

            res.status(200).json({
                "floor_id": result.identifiers[0].id
            });
        } catch (error) {
            console.error('[floors.controller][createFloor][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
            res.status(500).json({
                message: 'There was an error when adding new floor'
            });
        }
    }
};

export const updateFloorById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await FloorService.updateFloorById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[floors.controller][updateFloorById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating floor'
        });
    }
};

export const deleteFloorById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await FloorService.deleteFloorStatusById(parseInt(req.params.id));

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[floors.controller][deleteFloorById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting floor'
        });
    }
};