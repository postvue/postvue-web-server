import { MapAddressByGeoRsp } from 'global/interface/map';
import { MAP_ADDRESS_PATH } from 'services/appApiPath';
import { LATITUDE_PARAM, LONGITUDE_PARAM } from 'services/appApiQueryParam';
import { privateApi } from '..';

export const getMapAddressListByGeo = (
  latitude: number,
  longitude: number,
): Promise<MapAddressByGeoRsp[]> => {
  return privateApi
    .get(
      `${MAP_ADDRESS_PATH}?${LATITUDE_PARAM}=${latitude}&${LONGITUDE_PARAM}=${longitude}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
