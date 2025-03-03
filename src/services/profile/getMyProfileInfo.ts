import { optAuthApi, privateApi } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { INFO_PATH, MY_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export const getMyProfileInfo = (
  hasAuthToken: boolean,
): Promise<ProfileMyInfo> => {
  if (hasAuthToken) {
    return privateApi
      .get(`${PROFILE_LIST_PATH}${INFO_PATH}${MY_PATH}`)
      .then((res) => {
        console.log(res.data);
        return res.data.data;
      })
      .catch((error) => {
        throw error;
      });
  } else {
    return optAuthApi
      .get(`${PROFILE_LIST_PATH}${INFO_PATH}${MY_PATH}`)
      .then((res) => {
        console.log(res.data);
        return res.data.data;
      })
      .catch((error) => {
        throw error;
      });
  }
};
