import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_MAP_RECOMM_SEARCH_LIST,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { MapRecommSrchRsp } from 'global/interface/map';
import { isValidString } from 'global/util/ValidUtil';
import { getMapRecommSearchList } from 'services/maps/getMapRecommSearchList';

export const QueryStateMapRecommSearchList = (
  srchQry: string,
  isActive: boolean,
): UseQueryResult<MapRecommSrchRsp[], AxiosError<unknown, any>> => {
  return useQuery<MapRecommSrchRsp[], AxiosError>({
    queryKey: [QUERY_STATE_MAP_RECOMM_SEARCH_LIST, srchQry],
    queryFn: () => getMapRecommSearchList(srchQry),
    staleTime: STALE_30_MINUTES_TIME,
    retry: false,
    enabled: isValidString(srchQry) && isActive,
  });
};
