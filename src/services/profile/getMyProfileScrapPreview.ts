import { privateApi } from '..';
import { GetMyProfileScrapPreviewsRsp } from '../../global/interface/profile';
import {
  PREVIEW_LIST_PATH,
  PROFILE_LIST_PATH,
  SCRAP_LIST_PATH,
} from '../appApiPath';
import { POST_ID_PARAM } from '../appApiQueryParam';

export const getMyProfileScrapPreviews = (
  postId: string,
): Promise<GetMyProfileScrapPreviewsRsp[]> => {
  return privateApi
    .get(
      `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}${PREVIEW_LIST_PATH}?${POST_ID_PARAM}=${postId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
