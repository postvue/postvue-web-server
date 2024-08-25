import { api } from '..';
import { PostCommentReq, PostCommentRsp } from '../../global/interface/post';

import { COMMENT_LIST_PATH, POST_LIST_PATH } from '../appApiPath';

export const createPostComment = (
  postId: string,
  postCommentReq: PostCommentReq,
): Promise<PostCommentRsp> => {
  return api
    .post(`${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}`, postCommentReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
