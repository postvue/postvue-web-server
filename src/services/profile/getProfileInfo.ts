import { ProfileInfo } from 'global/interface/profile';
import { api } from '..';
import { INFO_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export const getProfileInfo = (username: string): Promise<ProfileInfo> => {
  return api
    .get(`${PROFILE_LIST_PATH}/${username}${INFO_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
