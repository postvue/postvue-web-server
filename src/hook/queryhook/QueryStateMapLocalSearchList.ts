import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_MAP_LOCAL_SEARCH_LIST,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { MapLocalSrchRsp } from 'global/interface/map';
import { isValidString } from 'global/util/ValidUtil';
import { getMapLocalSearchList } from 'services/maps/getMapLocalSearchList';

export const QueryStateMapLocalSearchList = (
  srchQry: string,
  isAcitve: boolean,
): UseQueryResult<MapLocalSrchRsp[], AxiosError<unknown, any>> => {
  return useQuery<MapLocalSrchRsp[], AxiosError>({
    queryKey: [QUERY_STATE_MAP_LOCAL_SEARCH_LIST, srchQry],
    queryFn: () => getMapLocalSearchList(srchQry),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isValidString(srchQry) && isAcitve,
    retry: false,
  });
};
