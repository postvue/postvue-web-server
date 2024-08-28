import { api } from '..';
import { PostInterested } from '../../global/interface/post';

import { INTERESTED, POST_LIST_PATH } from '../appApiPath';

export const putPostInterested = (postId: string): Promise<PostInterested> => {
  return api
    .put(`${POST_LIST_PATH}/${postId}${INTERESTED}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
