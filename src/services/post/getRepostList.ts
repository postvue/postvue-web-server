import { api } from '..';
import { PostProfileInfoRsp } from '../../global/interface/post';
import { POST_LIST_PATH, REPOST_LIST_PATH } from '../appApiPath';

interface GetRePostsRsp {
  cursorId: string;
  snsReactionRepostedRspList: PostProfileInfoRsp[];
}

export const getRePostList = (
  postId: string,
  cursorId: string,
): Promise<GetRePostsRsp> => {
  return api
    .get(`${POST_LIST_PATH}/${postId}${REPOST_LIST_PATH}?cursor=${cursorId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
