import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_PROFILE_SCRAP_INFO,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { isValidString } from 'global/util/ValidUtil';
import {
  getProfileScrapInfo,
  GetProfileScrapInfoRsp,
} from 'services/profile/getProfileScrapInfo';

export const QueryStateProfileScrapInfo = (
  scrapId: string,
): UseQueryResult<GetProfileScrapInfoRsp, AxiosError<unknown, any>> => {
  return useQuery<GetProfileScrapInfoRsp, AxiosError>({
    queryKey: [QUERY_STATE_PROFILE_SCRAP_INFO, scrapId],
    queryFn: () => getProfileScrapInfo(scrapId),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isValidString(scrapId),
    retry: false,
  });
};
