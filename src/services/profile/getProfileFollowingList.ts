import { optAuthApi } from '..';
import { PostProfileInfoRsp } from '../../global/interface/post';
import { FOLLOWING_PATH, PROFILE_LIST_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getProfileFollowingList = (
  username: string,
  page: number,
): Promise<PostProfileInfoRsp[]> => {
  return optAuthApi
    .get(
      `${PROFILE_LIST_PATH}/${username}${FOLLOWING_PATH}?${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
