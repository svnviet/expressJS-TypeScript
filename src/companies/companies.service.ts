import { AppDataSource } from '../data-source';
import { Company } from './companies.model';

const companyRepository = AppDataSource.getRepository(Company);

/**
 * get all companies
 */
export const getCompanies = async () => {
  return companyRepository.find();
};

/**
 * get company by id
 */
export const getCompanyById = async (id: Company['id']) => {
  return await companyRepository.findOneBy({ id: id });
};

/**
 * get company by company code
 */
export const getCompanyByCompanyCode = async (company_code: Company['company_code']) => {
  return await companyRepository.findOneBy({ company_code: company_code });
};

/**
 * add new company
 */
export const createCompany = async (input: Partial<Company>) => {
  // return await companyRepository.save(companyRepository.create(input));
  return await companyRepository.insert({
    company_code: input.company_code,
    company_name: input.company_name,
  });
};

/**
 * update company by id
 */
export const updateCompanyById = async (id: Company['id'], company: Company) => {
  const result = await companyRepository.update(id, {
    company_code: company.company_code,
    company_name: company.company_name
  });
  return result.affected > 0;
};

/**
 * update company status by id
 */
export const updateCompanyStatusById = async (id: Company['id'], status: Company['status']) => {
  const result = await companyRepository.update(id, { status: status, updated_at: new Date() });
  return result.affected > 0;
};

/**
 * soft delete company by id
 */
export const deleteCompanyById = async (id: Company['id']) => {
  const result = await companyRepository.softDelete(id);
  return result.affected > 0;
};