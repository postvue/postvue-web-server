import { api } from '..';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';

interface CreateProfileScrapRsp {
  postImagePathList: string[];
  scrapName: string;
  scrapId: string;
}

interface createProfileScrapReq {
  scrapName: string;
  targetAudienceValue: string;
}

export const postProfileScrap = (
  createProfileScrapReq: createProfileScrapReq,
): Promise<CreateProfileScrapRsp> => {
  return api
    .post(`${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}`, createProfileScrapReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
