import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_PROFILE_ACCOUNT_INFO,
  SERACH_FAVORITE_TERMS_STALE_TIME,
} from 'const/QueryClientConst';
import { ProfileInfo } from 'global/interface/profile';
import { getProfileInfo } from 'services/profile/getProfileInfo';

export const QueryStateProfileInfo = (
  username: string,
): UseQueryResult<ProfileInfo, AxiosError<unknown, any>> => {
  return useQuery<ProfileInfo, AxiosError>({
    queryKey: [QUERY_STATE_PROFILE_ACCOUNT_INFO, username],
    queryFn: () => getProfileInfo(username),
    staleTime: SERACH_FAVORITE_TERMS_STALE_TIME,
  });
};
