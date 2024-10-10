import { api } from '..';
import { PROFILE_EXISTENCE_PATH } from '../appApiPath';

export interface ProfileExistenceByUsernameRsp {
  useranme: string;
  isExisted: boolean;
}

export const getProfileExistenceByUsername = (
  username: string,
): Promise<ProfileExistenceByUsernameRsp> => {
  return api
    .get(`${PROFILE_EXISTENCE_PATH}/${username}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
