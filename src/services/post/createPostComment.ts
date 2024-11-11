import { formApi } from 'services';
import { PostComment } from '../../global/interface/post';

import { COMMENT_LIST_PATH, POST_LIST_PATH } from '../appApiPath';

export const createPostComment = (
  postId: string,
  formData: FormData,
): Promise<PostComment> => {
  return formApi
    .post(`${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}`, formData)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
