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
 * get user by uid
 */
export const getUserByUid = async (uid: User['uid']) => {
  return await userRepository.findOneBy({ uid: uid });
}

/**
 * get user's id by uid
 */
export const getUserIdByUid = async (uid: User['uid']) => {
  return await userRepository.query(`SELECT id FROM users WHERE uid = ?`, [uid]);
};

/**
 * get user's Mic Status by uid
 */
export const getUserMicStatusByUid = async (uid: User['uid']) => {
  return await userRepository.query(`SELECT uid, is_mic FROM users WHERE uid = ?`, [uid]);
};

/**
 * get user's Speaker Status by uid
 */
export const getUserSpeakerStatusByUid = async (uid: User['uid']) => {
  return await userRepository.query(`SELECT uid, is_speaker FROM users WHERE uid = ?`, [uid]);
};

/**
 * get user by email
 */
export const getUserByEmail = async (email: User['email']) => {
  return await userRepository.findOneBy({ email: email });
};

/**
 * get all users by status and company_id
 */
export const getUsersByStatusAndCompanyId = async (status: User['status'], company_id: User['company_id']) => {
  // return await userRepository.findBy({ status: status, company_id: company_id });
  return await userRepository.query(`
  SELECT id as user_id, role, onamae, login_status, is_mic, is_speaker, avatar
  FROM users
  WHERE status = ? AND company_id = ? AND deleted_at IS NULL`
    , [status, company_id]);
};

/**
 * get user'company_id by uid
 */
export const getCompanyIdByUid = async (uid: User['uid']) => {
  return await userRepository.query(`
  SELECT uid, company_id, id
  FROM users
  WHERE uid = ? AND deleted_at IS NULL`
    , [uid]);
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

/**
 * update user's is_mic by uid
 */
export const reverseMicStatus = async (uid: User['uid']) => {
  return await userRepository.query(`
  UPDATE users
  SET is_mic = CASE
    WHEN is_mic = 0 or is_mic IS NULL THEN 1
    WHEN is_mic = 1 THEN 0
    END
  WHERE uid = ?`
    , [uid]);
};

/**
 * update user's is_mic to ON (1) by uid
 */
export const setMicStatusOn = async (uid: User['uid']) => {
  return await userRepository.query(`
  UPDATE users
  SET is_mic = 1
  WHERE uid = ?`
    , [uid]);
};

/**
 * update user's is_mic to OFF (0) by uid
 */
export const setMicStatusOff = async (uid: User['uid']) => {
  return await userRepository.query(`
  UPDATE users
  SET is_mic = 0
  WHERE uid = ?`
    , [uid]);
};

/**
 * update user's is_speaker by uid
 */
export const reverseSpeakerStatus = async (uid: User['uid']) => {
  return await userRepository.query(`
  UPDATE users
  SET is_speaker = CASE
    WHEN is_speaker = 0 or is_speaker IS NULL THEN 1
    WHEN is_speaker = 1 THEN 0
    END
  WHERE uid = ?`
    , [uid]);
};

/**
 * update user's is_speaker to ON (1) by uid
 */
export const setSpeakerStatusOn = async (uid: User['uid']) => {
  return await userRepository.query(`
  UPDATE users
  SET is_speaker = 1
  WHERE uid = ?`
    , [uid]);
};

/**
 * update user's is_speaker to OFF (0) by uid
 */
export const setSpeakerStatusOff = async (uid: User['uid']) => {
  return await userRepository.query(`
  UPDATE users
  SET is_speaker = 0
  WHERE uid = ?`
    , [uid]);
};

/**
 * update user's onamae by uid
 */
export const updateUserOnamaeByUid = async (uid: User['uid'], user: User) => {
  return await userRepository.query(`
  UPDATE users
  SET onamae = ?
  WHERE uid = ?`
    , [user.onamae, uid]);
};

/**
 * update user's avatar by uid
 */
export const updateUserAvatarByUid = async (uid: User['uid'], user: User) => {
  return await userRepository.query(`
  UPDATE users
  SET avatar = ?
  WHERE uid = ?`
    , [user.avatar, uid]);
};

/**
 * update user's login_status by uid
 */
 export const updateUserLoginStatusByUid = async (uid: User['uid'], custom_status: string = '', user: User) => {
  if (custom_status) {
    return await userRepository.query(`
      UPDATE users
        SET login_status = ? , custom_status= ?
      WHERE uid = ?`
      , [user.login_status, custom_status, uid]);
  }
  return await userRepository.query(`
  UPDATE users
    SET login_status = ?
  WHERE uid = ?`
    , [user.login_status, uid]);
};