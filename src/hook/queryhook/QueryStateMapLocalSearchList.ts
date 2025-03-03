import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_MAP_LOCAL_SEARCH_LIST,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { MapLocalSrchRsp } from 'global/interface/map';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { getMapLocalSearchList } from 'services/maps/getMapLocalSearchList';

export const QueryStateMapLocalSearchList = (
  srchQry: string,
  identifier: string,
  latitude: number,
  longitude: number,
  isAcitve: boolean,
): UseQueryResult<MapLocalSrchRsp[], AxiosError<unknown, any>> => {
  return useQuery<MapLocalSrchRsp[], AxiosError>({
    queryKey: [
      QUERY_STATE_MAP_LOCAL_SEARCH_LIST,
      convertQueryTemplate(identifier, srchQry),
    ],
    queryFn: () => getMapLocalSearchList(srchQry, latitude, longitude),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isValidString(srchQry) && isAcitve,
    retry: false,
  });
};
