import { api } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_LIST_PATH } from '../appApiPath';

export const getPost = (postId: string): Promise<PostRsp> => {
  return api
    .get(`${POST_LIST_PATH}/${postId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
