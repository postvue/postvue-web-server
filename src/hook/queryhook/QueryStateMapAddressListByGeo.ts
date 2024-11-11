import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_MAP_ADDRESS_LIST_BY_GEO,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { MapAddressByGeoRsp } from 'global/interface/map';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { getMapAddressListByGeo } from 'services/maps/getMapAddressListByGeo';

export const QueryStateMapAddressListByGeo = (
  latitude: number,
  longitude: number,
  isActive = true,
): UseQueryResult<MapAddressByGeoRsp[], AxiosError<unknown, any>> => {
  return useQuery<MapAddressByGeoRsp[], AxiosError>({
    queryKey: [
      convertQueryTemplate(
        QUERY_STATE_MAP_ADDRESS_LIST_BY_GEO,
        `${latitude + longitude}`,
      ),
    ],
    queryFn: () => getMapAddressListByGeo(latitude, longitude),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isActive,
    retry: false,
  });
};
