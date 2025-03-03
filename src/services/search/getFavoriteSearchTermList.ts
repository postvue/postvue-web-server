import { PAGE_PARAM } from 'services/appApiQueryParam';
import { privateApi } from '..';
import { GetFavoriteTermRsp } from '../../global/interface/search';

import { FAVORITE_PATH, SEARCH_PATH, TERM_LIST_PATH } from '../appApiPath';

export const getFavoriteSearchTermList = (
  page: number,
): Promise<GetFavoriteTermRsp[]> => {
  return privateApi
    .get(
      `${SEARCH_PATH}${FAVORITE_PATH}${TERM_LIST_PATH}?${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
