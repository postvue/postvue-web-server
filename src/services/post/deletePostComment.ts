import { privateApi } from '..';
import { PostLikeRsp } from '../../global/interface/post';

import { COMMENT_LIST_PATH, POST_LIST_PATH } from '../appApiPath';

export const deletePostComment = (commentId: string): Promise<PostLikeRsp> => {
  return privateApi
    .delete(`${POST_LIST_PATH}${COMMENT_LIST_PATH}/${commentId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
