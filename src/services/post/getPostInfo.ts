import { privateApi } from '..';
import { PostInfoRsp } from '../../global/interface/post';
import { INFO_PATH, POST_LIST_PATH } from '../appApiPath';

export const getPostInfo = (postId: string): Promise<PostInfoRsp> => {
  return privateApi
    .get(`${POST_LIST_PATH}/${postId}${INFO_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
