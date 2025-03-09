import { optAuthApi } from '..';
import { GetFavoriteTermRsp } from '../../global/interface/search';

import {
  FAVORITE_PATH,
  PREVIEW_LIST_PATH,
  SEARCH_PATH,
  TERM_LIST_PATH,
} from '../appApiPath';

export const getFavoriteSearchTermPreviewList = (): Promise<
  GetFavoriteTermRsp[]
> => {
  return optAuthApi
    .get(`${SEARCH_PATH}${FAVORITE_PATH}${TERM_LIST_PATH}${PREVIEW_LIST_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
