import { MapPostSrchRsp } from 'global/interface/map';
import { MAP_POST_SEARCH_PATH } from 'services/appApiPath';
import { PAGE_PARAM, SEARCH_QUERY_PARAM } from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getMapPostSearchList = (
  srchQry: string,
  page: number,
): Promise<MapPostSrchRsp[]> => {
  return optAuthApi
    .get(
      `${MAP_POST_SEARCH_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}&${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
