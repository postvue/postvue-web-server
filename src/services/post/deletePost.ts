import { optAuthApi } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_LIST_PATH } from '../appApiPath';

export const deletePost = (postId: string): Promise<PostRsp> => {
  return optAuthApi
    .delete(`${POST_LIST_PATH}/${postId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
