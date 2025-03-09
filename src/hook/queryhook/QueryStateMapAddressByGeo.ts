import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_MAP_ADDRESS_BY_GEO,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { MapAddressByGeoRsp } from 'global/interface/map';
import { getMapAddressByGeo } from 'services/maps/getMapAddressByGeo';

export const QueryStateMapAddressByGeo = (
  latitude: number,
  longitude: number,
  isActive = true,
): UseQueryResult<MapAddressByGeoRsp, AxiosError<unknown, any>> => {
  return useQuery<MapAddressByGeoRsp, AxiosError>({
    queryKey: [QUERY_STATE_MAP_ADDRESS_BY_GEO, latitude + longitude],
    queryFn: () => getMapAddressByGeo(latitude, longitude),
    staleTime: STALE_30_MINUTES_TIME,
    retry: false,
    enabled: isActive,
  });
};
