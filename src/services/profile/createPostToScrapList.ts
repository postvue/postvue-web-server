import { privateApi } from '..';
import {
  PostToScrapListReq,
  PostToScrapListRsp,
} from '../../global/interface/profile';
import {
  POST_LIST_PATH,
  PROFILE_LIST_PATH,
  SCRAP_LIST_PATH,
} from '../appApiPath';

export const createPostToScrapList = (
  scrapIdList: PostToScrapListReq,
  postId: string,
): Promise<PostToScrapListRsp> => {
  return privateApi
    .post(
      `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}${POST_LIST_PATH}/${postId}`,
      scrapIdList,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
