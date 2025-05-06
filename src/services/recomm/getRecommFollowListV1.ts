import { PAGE_PARAM } from 'services/appApiQueryParam';
import { optAuthApi } from '..';
import { RecommFollowInfo } from '../../global/interface/recomm';
import { FOLLOW_PATH, RECOMM_V1_PATH } from '../appApiPath';

export const getRecommFollowListV1 = (
  page: number,
): Promise<RecommFollowInfo[]> => {
  return optAuthApi
    .get(`${RECOMM_V1_PATH}${FOLLOW_PATH}?${PAGE_PARAM}=${page}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
