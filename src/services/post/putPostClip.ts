import { api } from '..';
import { PostClipRsp } from '../../global/interface/post';

import { CLIP_PATH, POST_LIST_PATH } from '../appApiPath';

export const putPostClip = (postId: string): Promise<PostClipRsp> => {
  return api
    .put(`${POST_LIST_PATH}/${postId}${CLIP_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
