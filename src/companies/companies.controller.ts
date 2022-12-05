import { Request, RequestHandler, Response } from 'express';
import * as CompanyService from './companies.service';

export const getAllCompanies: RequestHandler = async (req: Request, res: Response) => {
    try {
        const companies = await CompanyService.getCompanies();

        res.status(200).json({
            companies
        });
    } catch (error) {
        console.error('[companies.controller][getAllCompanies][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching companies'
        });
    }
};

export const getCompanyById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const company = await CompanyService.getCompanyById(parseInt(req.params.id));

        res.status(200).json({
            company
        });
    } catch (error) {
        console.error('[companies.controller][getCompanyById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching company'
        });
    }
};

export const createCompany: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await CompanyService.createCompany(req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[companies.controller][createCompany][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new company'
        });
    }
};

export const updateCompanyById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await CompanyService.updateCompanyById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[companies.controller][updateCompanyById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating company'
        });
    }
};

export const deleteCompanyById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await CompanyService.deleteCompanyById(parseInt(req.params.id));

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[companies.controller][deleteCompanyById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting company'
        });
    }
};