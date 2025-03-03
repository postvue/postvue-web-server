import { MapLocalSrchRsp } from 'global/interface/map';
import { MAP_LOCAL_SEARCH_PATH } from 'services/appApiPath';
import {
  LATITUDE_PARAM,
  LONGITUDE_PARAM,
  SEARCH_QUERY_PARAM,
} from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getMapLocalSearchList = (
  srchQry: string,
  lat: number,
  lng: number,
): Promise<MapLocalSrchRsp[]> => {
  return optAuthApi
    .get(
      `${MAP_LOCAL_SEARCH_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}&${LATITUDE_PARAM}=${lat}&${LONGITUDE_PARAM}=${lng}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
