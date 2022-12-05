import { AppDataSource } from '../data-source';
import { User } from './users.model';

const userRepository = AppDataSource.getRepository(User);

/**
 * get all users
 */
export const getUsers = async () => {
  return userRepository.find();
};

/**
 * get user by id
 */
export const getUserById = async (id: User['id']) => {
  return await userRepository.findOneBy({ id: id });
};

/**
 * get user by email
 */
export const getUserByEmail = async (email: User['email']) => {
  return await userRepository.findOneBy({ email: email });
};

/**
 * add new user
 */
export const createUser = async (input: Partial<User>) => {
  // return await userRepository.save(userRepository.create(input));
  return await userRepository.insert({
    uid: input.uid,
    company_id: input.company_id,
    email: input.email,
    code: input.code,
    password: input.password,
    onamae: input.onamae,
  });
};

/**
 * update user by id
 */
export const updateUserById = async (id: User['id'], user: User) => {
  const result = await userRepository.update(id, {
    uid: user.uid,
    company_id: user.company_id,
    email: user.email,
    code: user.code,
    password: user.password,
    onamae: user.onamae
  });
  return result.affected > 0;
};

/**
 * update user status by id
 */
export const updateUserStatusById = async (id: User['id'], status: User['status']) => {
  const result = await userRepository.update(id, { status: status, updated_at: new Date() });
  return result.affected > 0;
};

/**
 * soft delete user by id
 */
export const deleteUserById = async (id: User['id']) => {
  const result = await userRepository.softDelete(id);
  return result.affected > 0;
};