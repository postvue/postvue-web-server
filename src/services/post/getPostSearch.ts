import { api } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_LIST_PATH, SEARCH_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetSearchPostsRsp {
  cursorId: string;
  snsPostRspList: PostRsp[];
}

export const getPostSearch = (
  searchWord: string,
  cursorId: string,
): Promise<GetSearchPostsRsp> => {
  return api
    .get(`${POST_LIST_PATH}${SEARCH_PATH}?${CURSOR_PARAM}${cursorId}`, {
      params: {
        srch_qry: searchWord,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
