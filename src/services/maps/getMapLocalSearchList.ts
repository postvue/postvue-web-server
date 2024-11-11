import { MapLocalSrchRsp } from 'global/interface/map';
import { MAP_LOCAL_SEARCH_PATH } from 'services/appApiPath';
import { SEARCH_QUERY_PARAM } from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getMapLocalSearchList = (
  srchQry: string,
): Promise<MapLocalSrchRsp[]> => {
  return optAuthApi
    .get(`${MAP_LOCAL_SEARCH_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
