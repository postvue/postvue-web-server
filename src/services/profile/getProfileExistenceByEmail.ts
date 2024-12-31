import { api } from '..';
import { PROFILE_EXISTENCE_EMAIL_API_PATH } from '../appApiPath';

export interface ProfileExistenceByEmailRsp {
  email: string;
  isExisted: boolean;
}

export const getProfileExistenceByEmail = (
  email: string,
): Promise<ProfileExistenceByEmailRsp> => {
  return api
    .get(`${PROFILE_EXISTENCE_EMAIL_API_PATH}/${email}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
