import { GetSearchPostsRsp } from 'global/interface/search';
import { optAuthApi } from '..';
import { LIVE_PATH, POST_LIST_PATH, SEARCH_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getPostSearchLive = (
  searchWord: string,
  page: number,
): Promise<GetSearchPostsRsp> => {
  return optAuthApi
    .get(`${POST_LIST_PATH}${SEARCH_PATH}${LIVE_PATH}?${PAGE_PARAM}=${page}`, {
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
