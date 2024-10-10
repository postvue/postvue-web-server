import { privateApi } from '..';
import { PostProfileInfoRsp } from '../../global/interface/post';
import { FOLLOWING_PATH, MY_PATH, PROFILE_LIST_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getMyProfileFollowingList = (
  page: number,
): Promise<PostProfileInfoRsp[]> => {
  return privateApi
    .get(
      `${PROFILE_LIST_PATH}${MY_PATH}${FOLLOWING_PATH}?${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
