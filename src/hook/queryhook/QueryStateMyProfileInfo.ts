import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  MY_PROFILE_STALE_TIME,
  QUERY_STATE_MY_PROFILE_INFO,
} from 'const/QueryClientConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { getMyProfileInfo } from 'services/profile/getMyProfileInfo';

export const QueryStateMyProfileInfo = (
  active = true,
  hasAuthToken = true,
): UseQueryResult<ProfileMyInfo, AxiosError<unknown, any>> => {
  return useQuery<ProfileMyInfo, AxiosError>({
    queryKey: [QUERY_STATE_MY_PROFILE_INFO],
    queryFn: () => getMyProfileInfo(hasAuthToken),
    staleTime: MY_PROFILE_STALE_TIME,
    enabled: active,
    retry: false,
  });
};
