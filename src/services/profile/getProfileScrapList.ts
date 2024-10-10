import { privateApi } from '..';
import { ProfileScrapList } from '../../global/interface/profile';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getProfileScrapList = (
  page: number,
): Promise<ProfileScrapList[]> => {
  return privateApi
    .get(`${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}?${PAGE_PARAM}=${page}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
