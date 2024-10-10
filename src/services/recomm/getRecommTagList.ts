import { optAuthApi } from '..';
import { RecommTagInfo } from '../../global/interface/recomm';
import { RECOMM_PATH, TAG_LIST_PATH } from '../appApiPath';

export const getRecommTagList = (): Promise<RecommTagInfo[]> => {
  return optAuthApi
    .get(`${RECOMM_PATH}${TAG_LIST_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
