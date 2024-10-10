import { privateApi } from '..';
import { PutFavoriteSearchTermReq } from '../../global/interface/search';

import { FAVORITE_PATH, SEARCH_PATH, TERM_LIST_PATH } from '../appApiPath';

export const putFavoriteSearchTerm = (
  putFavoriteSearchTermReq: PutFavoriteSearchTermReq,
): Promise<boolean> => {
  return privateApi
    .put(
      `${SEARCH_PATH}${FAVORITE_PATH}${TERM_LIST_PATH}`,
      putFavoriteSearchTermReq,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
