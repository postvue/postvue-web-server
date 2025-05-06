import { optAuthApi } from '..';
import { ProfileThumbnailScrapList } from '../../global/interface/profile';
import { RECOMM_V1_PATH, SCRAP_LIST_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getRecommScrapList = (
  page: number,
): Promise<ProfileThumbnailScrapList[]> => {
  return optAuthApi
    .get(`${RECOMM_V1_PATH}${SCRAP_LIST_PATH}?${PAGE_PARAM}=${page}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
