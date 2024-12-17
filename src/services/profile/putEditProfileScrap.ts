import { myPostScrapPreview } from 'global/interface/profile';
import { privateApi } from '..';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';

interface PutProfileScrapRsp {
  myPostScrapPreviewList: myPostScrapPreview[];
  scrapName: string;
  scrapId: string;
}

interface putProfileScrapReq {
  scrapName: string;
  targetAudienceValue: string;
}

export const putEditProfileScrap = (
  scrapId: string,
  putProfileScrapReq: putProfileScrapReq,
): Promise<PutProfileScrapRsp> => {
  const editProfileScrapPath = `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}/${scrapId}`;

  return privateApi
    .put(editProfileScrapPath, putProfileScrapReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
