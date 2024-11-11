import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_MAP_LOCATION,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { MapLocationRsp } from 'global/interface/map';
import { getMapLocation } from 'services/maps/getMapLocation';

export const QueryStateMapLocation = (
  address: string,
): UseQueryResult<MapLocationRsp, AxiosError<unknown, any>> => {
  return useQuery<MapLocationRsp, AxiosError>({
    queryKey: [QUERY_STATE_MAP_LOCATION, address],
    queryFn: () => getMapLocation(address),
    staleTime: STALE_30_MINUTES_TIME,

    retry: false,
  });
};
