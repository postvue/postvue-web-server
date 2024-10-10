import { optAuthApi } from '..';
import { PostComment } from '../../global/interface/post';
import { COMMENT_LIST_PATH, POST_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetPostCommentsRsp {
  cursorId: string;
  snsPostCommentRspList: PostComment[];
}

export const getPostComments = (
  postId: string,
  cursorId: string,
): Promise<GetPostCommentsRsp> => {
  return optAuthApi
    .get(
      `${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}?${CURSOR_PARAM}=${cursorId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
