import { api } from '..';
import { MyProfileScrapList } from '../../global/interface/profile';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetMyProfileScrapListRsp {
  cursorId: string;
  myScrapLists: MyProfileScrapList[];
}

export const getMyProfileScrapList = (
  cursorId: string,
): Promise<GetMyProfileScrapListRsp> => {
  return api
    .get(`${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}?${CURSOR_PARAM}=${cursorId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
