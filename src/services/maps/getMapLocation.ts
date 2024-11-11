import { MapLocationRsp } from 'global/interface/map';
import { MAP_LOCATION_PATH } from 'services/appApiPath';
import { ADDRESS_PARAM } from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getMapLocation = (address: string): Promise<MapLocationRsp> => {
  return optAuthApi
    .get(`${MAP_LOCATION_PATH}?${ADDRESS_PARAM}=${address}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
