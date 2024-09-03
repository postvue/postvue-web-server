import { api } from '..';
import { PostCommentReq, PostCommentRsp } from '../../global/interface/post';

import { COMMENT_LIST_PATH, POST_LIST_PATH } from '../appApiPath';
import { IS_THREAD } from '../appApiQueryParam';

export const createPostCommentReply = (
  postId: string,
  commentId: string,
  postCommentReq: PostCommentReq,
  isThread = false,
): Promise<PostCommentRsp> => {
  let apiPath = `${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}/${commentId}`;
  if (isThread) {
    apiPath += `?${IS_THREAD}=${isThread}`;
  }
  console.log(apiPath);

  return api
    .post(apiPath, postCommentReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
