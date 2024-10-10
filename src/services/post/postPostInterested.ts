import { privateApi } from '..';
import { PostInterested } from '../../global/interface/post';

import { INTERESTED, POST_LIST_PATH } from '../appApiPath';

export const postPostInterested = (postId: string): Promise<PostInterested> => {
  return privateApi
    .post(`${POST_LIST_PATH}/${postId}${INTERESTED}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
