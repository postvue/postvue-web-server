import { api } from '..';
import { PostLikeGsp } from '../../global/interface/post';

import { COMMENT_LIST_PATH, LIKE_PATH, POST_LIST_PATH } from '../appApiPath';

export const putPostCommentLike = (
  postId: string,
  commentId: string,
): Promise<PostLikeGsp> => {
  return api
    .put(
      `${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}/${commentId}${LIKE_PATH}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
