import { api } from '..';
import { PostToScrapRsp } from '../../global/interface/profile';
import {
  POST_LIST_PATH,
  PROFILE_LIST_PATH,
  SCRAP_LIST_PATH,
} from '../appApiPath';

export const deletePostToScrap = (
  scrapId: string,
  postId: string,
): Promise<PostToScrapRsp> => {
  return api
    .delete(
      `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}/${scrapId}${POST_LIST_PATH}/${postId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
