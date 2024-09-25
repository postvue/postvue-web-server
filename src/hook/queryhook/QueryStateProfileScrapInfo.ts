import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_PROFILE_SCRAP_INFO,
  SERACH_FAVORITE_TERMS_STALE_TIME,
} from 'const/QueryClientConst';
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
    staleTime: SERACH_FAVORITE_TERMS_STALE_TIME,
  });
};
