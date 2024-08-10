import { api } from '..';
import { PostProfileInfoRsp } from '../../global/interface/post';
import { LIKE_LIST_PATH, POST_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetRePostsRsp {
  cursorId: string;
  snsPostLikeGetRspList: PostProfileInfoRsp[];
}

export const getPostLikeList = (
  postId: string,
  cursorId: string,
): Promise<GetRePostsRsp> => {
  return api
    .get(
      `${POST_LIST_PATH}/${postId}${LIKE_LIST_PATH}?${CURSOR_PARAM}=${cursorId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
