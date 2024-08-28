import { api } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_LIST_PATH, RECOMM_PATH, RELATION_PATH } from '../appApiPath';

interface GetPostRelationRsp {
  cursorId: string;
  snsPostRspList: PostRsp[];
}

export const getPostRelation = (
  postId: string,
): Promise<GetPostRelationRsp> => {
  return api
    .get(`${RECOMM_PATH}${POST_LIST_PATH}/${postId}${RELATION_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
