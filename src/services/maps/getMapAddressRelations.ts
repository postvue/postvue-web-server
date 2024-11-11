import { MapAddressRelation } from 'global/interface/map';
import { MAP_ADDRESS_REPLATION_PATH } from 'services/appApiPath';
import { PAGE_PARAM, SEARCH_QUERY_PARAM } from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getMapAddressReplations = (
  srchQry: string,
  page: number,
): Promise<MapAddressRelation[]> => {
  return optAuthApi
    .get(
      `${MAP_ADDRESS_REPLATION_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}&${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
