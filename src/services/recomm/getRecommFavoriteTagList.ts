import { PAGE_PARAM } from 'services/appApiQueryParam';
import { api } from '..';
import { RecommTagInfo } from '../../global/interface/recomm';
import { FAVORITE_PATH, RECOMM_PATH, TAG_LIST_PATH } from '../appApiPath';

export const getRecommFavoriteTagList = (
  page: number,
): Promise<RecommTagInfo[]> => {
  return api
    .get(`${RECOMM_PATH}${FAVORITE_PATH}${TAG_LIST_PATH}?${PAGE_PARAM}=${page}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
