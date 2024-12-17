import { optAuthApi } from '..';
import { ProfileScrap } from '../../global/interface/profile';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

export interface GetMyProfileScrapRsp {
  cursorId: string;
  scrapPostList: ProfileScrap[];
}

export const getProfileScrap = (
  cursorId: string,
  scrapId: string,
): Promise<GetMyProfileScrapRsp> => {
  return optAuthApi
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
