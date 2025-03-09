import { GetSearchPostsRsp } from 'global/interface/search';
import { optAuthApi } from '..';
import { NEAR_PATH, POST_LIST_PATH, SEARCH_PATH } from '../appApiPath';
import {
  LATITUDE_PARAM,
  LONGITUDE_PARAM,
  PAGE_PARAM,
} from '../appApiQueryParam';

export const getPostSearchNear = (
  searchWord: string,
  latitude: number,
  longitude: number,
  page: number,
): Promise<GetSearchPostsRsp> => {
  return optAuthApi
    .get(
      `${POST_LIST_PATH}${SEARCH_PATH}${NEAR_PATH}?${LATITUDE_PARAM}=${latitude}&${LONGITUDE_PARAM}=${longitude}&${PAGE_PARAM}=${page}`,
      {
        params: {
          srch_qry: searchWord,
        },
      },
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
