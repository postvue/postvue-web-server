import { api } from '..';
import { MyProfileScrap } from '../../global/interface/profile';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM, WITH_SCRAP_INFO_PARAM } from '../appApiQueryParam';

interface GetMyProfileScrapRsp {
  cursorId: string;
  myScrapPostList: MyProfileScrap[];
  scrapName: string;
  scrapId: string;
}

export const getMyProfileScrap = (
  cursorId: string,
  scrapId: string,
  withScrapInfo = false,
): Promise<GetMyProfileScrapRsp> => {
  return api
    .get(
      `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}/${scrapId}?${CURSOR_PARAM}=${cursorId}&${WITH_SCRAP_INFO_PARAM}=${withScrapInfo}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
