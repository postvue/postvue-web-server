import { api } from '..';
import { PostProfileInfoRsp } from '../../global/interface/post';
import { FOLLOWER_PATH, PROFILE_LIST_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getMyProfileFollowerList = (
  username: string,
  page: number,
): Promise<PostProfileInfoRsp[]> => {
  return api
    .get(
      `${PROFILE_LIST_PATH}/${username}${FOLLOWER_PATH}?${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
