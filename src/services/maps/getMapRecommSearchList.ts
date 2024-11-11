import { MapRecommSrchRsp } from 'global/interface/map';
import { MAP_RECOMM_SEARCH_PATH } from 'services/appApiPath';
import { SEARCH_QUERY_PARAM } from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getMapRecommSearchList = (
  srchQry: string,
): Promise<MapRecommSrchRsp[]> => {
  return optAuthApi
    .get(`${MAP_RECOMM_SEARCH_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
