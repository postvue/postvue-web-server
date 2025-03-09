import { optAuthApi } from '..';
import { RecommFollowInfo } from '../../global/interface/recomm';
import { FOLLOW_PATH, RECOMM_PATH } from '../appApiPath';

export const getRecommFollowList = (): Promise<RecommFollowInfo[]> => {
  return optAuthApi
    .get(`${RECOMM_PATH}${FOLLOW_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
