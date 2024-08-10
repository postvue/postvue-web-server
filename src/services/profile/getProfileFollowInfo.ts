import { api } from '..';
import { FollowProfileInfo } from '../../global/interface/profile';
import { FOLLOW_PATH, INFO_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export const getProfileFollowInfo = (
  username: string,
): Promise<FollowProfileInfo> => {
  return api
    .get(`${PROFILE_LIST_PATH}${FOLLOW_PATH}/${username}${INFO_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
