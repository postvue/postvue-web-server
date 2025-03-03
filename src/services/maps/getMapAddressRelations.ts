import { MapAddressRelation } from 'global/interface/map';
import { MAP_ADDRESS_REPLATION_PATH } from 'services/appApiPath';
import {
  LATITUDE_PARAM,
  LONGITUDE_PARAM,
  PAGE_PARAM,
  SEARCH_QUERY_PARAM,
} from 'services/appApiQueryParam';
import { privateApi } from '..';

export const getMapAddressReplations = (
  srchQry: string,
  page: number,
  latitude?: number,
  longitude?: number,
): Promise<MapAddressRelation[]> => {
  const url = `${MAP_ADDRESS_REPLATION_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}&${PAGE_PARAM}=${page}`;
  const urlWithParam =
    latitude && longitude
      ? url + `&${LATITUDE_PARAM}=${latitude}&${LONGITUDE_PARAM}=${longitude}`
      : url;

  return privateApi
    .get(urlWithParam)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
