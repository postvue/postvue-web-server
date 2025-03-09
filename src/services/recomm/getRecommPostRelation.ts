import { optAuthApi } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_LIST_PATH, RECOMM_PATH, RELATION_PATH } from '../appApiPath';
import { PAGE_PARAM, SEARCH_TYPE_PARAM } from '../appApiQueryParam';

// export interface GetRecommPostRelationRsp {
//   page: number;
//   snsPostRspList: PostRsp[];
// }

export const getRecommPostRelation = (
  postId: string,
  searchType: string,
  page: number,
): Promise<PostRsp[]> => {
  return optAuthApi
    .get(
      `${RECOMM_PATH}${POST_LIST_PATH}/${postId}${RELATION_PATH}?${PAGE_PARAM}=${page}&${SEARCH_TYPE_PARAM}=${searchType}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
