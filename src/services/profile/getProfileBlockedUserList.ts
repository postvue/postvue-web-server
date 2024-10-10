import { PROFILE_PROFILE_BLOCKED_USER_LIST_API_PATH } from 'services/appApiPath';
import { PAGE_PARAM } from 'services/appApiQueryParam';
import { privateApi } from '..';
import { ProfileBlockedUserRsp } from '../../global/interface/profile';

export const getProfileBlockedUserList = (
  page: number,
): Promise<ProfileBlockedUserRsp[]> => {
  return privateApi
    .get(`${PROFILE_PROFILE_BLOCKED_USER_LIST_API_PATH}?${PAGE_PARAM}=${page}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
