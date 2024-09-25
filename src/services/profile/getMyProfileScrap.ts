import { api } from '..';
import { MyProfileScrap } from '../../global/interface/profile';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

export interface GetMyProfileScrapRsp {
  cursorId: string;
  myScrapPostList: MyProfileScrap[];
}

export const getMyProfileScrap = (
  cursorId: string,
  scrapId: string,
): Promise<GetMyProfileScrapRsp> => {
  return api
    .get(
      `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}/${scrapId}?${CURSOR_PARAM}=${cursorId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
