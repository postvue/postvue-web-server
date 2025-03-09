import { optAuthApi } from '..';
import { GetSearchTermRsp } from '../../global/interface/search';

import { INFO_PATH, SEARCH_PATH, TERM_LIST_PATH } from '../appApiPath';

export const getSearchTermInfo = (
  searchTerm: string,
): Promise<GetSearchTermRsp> => {
  return optAuthApi
    .get(
      `${SEARCH_PATH}${TERM_LIST_PATH}/${encodeURIComponent(searchTerm)}${INFO_PATH}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
