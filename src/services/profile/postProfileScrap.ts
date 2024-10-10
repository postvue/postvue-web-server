import { myPostScrapPreview } from 'global/interface/profile';
import { privateApi } from '..';
import { isValidString } from '../../global/util/ValidUtil';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { POST_ID_PARAM } from '../appApiQueryParam';

interface CreateProfileScrapRsp {
  myPostScrapPreviewList: myPostScrapPreview[];
  scrapName: string;
  scrapId: string;
}

interface createProfileScrapReq {
  scrapName: string;
  targetAudienceValue: string;
}

export const postProfileScrap = (
  createProfileScrapReq: createProfileScrapReq,
  postId: string,
): Promise<CreateProfileScrapRsp> => {
  let makeProfileScrapPath = `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}`;
  if (isValidString(postId)) {
    makeProfileScrapPath = `${makeProfileScrapPath}?${POST_ID_PARAM}=${postId}`;
  }
  return privateApi
    .post(makeProfileScrapPath, createProfileScrapReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
