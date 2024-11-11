import { formApi } from '..';
import { PostComment } from '../../global/interface/post';

import { COMMENT_LIST_PATH, POST_LIST_PATH } from '../appApiPath';
import { IS_THREAD } from '../appApiQueryParam';

export const createPostCommentReply = (
  postId: string,
  commentId: string,
  isThread = false,
  formData: FormData,
): Promise<PostComment> => {
  let apiPath = `${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}/${commentId}`;
  if (isThread) {
    apiPath += `?${IS_THREAD}=${isThread}`;
  }

  return formApi
    .post(apiPath, formData)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
