import { SEARCH_PATH } from 'const/PathConst';
import { privateApi } from '..';
import { ProfileThumbnailScrapList } from '../../global/interface/profile';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getProfileScrapListBySearchQuery = (
  page: number,
  searchQuery: string,
): Promise<ProfileThumbnailScrapList[]> => {
  return privateApi
    .get(
      `${PROFILE_LIST_PATH}${SEARCH_PATH}${SCRAP_LIST_PATH}/${encodeURIComponent(searchQuery)}?${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
