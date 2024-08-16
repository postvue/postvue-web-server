import { api } from '..';
import { PostLikeRsp } from '../../global/interface/post';

import { LIKE_PATH, POST_LIST_PATH } from '../appApiPath';

export const putPostLike = (postId: string): Promise<PostLikeRsp> => {
  return api
    .put(`${POST_LIST_PATH}/${postId}${LIKE_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
