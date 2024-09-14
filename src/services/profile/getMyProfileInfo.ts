import { api } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { INFO_PATH, MY_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export const getMyProfileInfo = (): Promise<ProfileMyInfo> => {
  return api
    .get(`${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
