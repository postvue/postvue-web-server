import { api } from '..';
import { INFO_PATH, PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';

export interface GetProfileScrapInfoRsp {
  scrapName: string;
  scrapId: string;
  scrapNum: number;
  lastPostedAt: string;
}

export const getProfileScrapInfo = (
  scrapId: string,
): Promise<GetProfileScrapInfoRsp> => {
  return api
    .get(`${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}/${scrapId}${INFO_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
