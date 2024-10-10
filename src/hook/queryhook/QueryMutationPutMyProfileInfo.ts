import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import { QUERY_STATE_MY_PROFILE_INFO } from 'const/QueryClientConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { initMyAccountSettingInfo } from 'global/util/MyAccountSettingUtil';
import {
  putMyProfileInfo,
  PutMyProfileInfoReq,
} from 'services/profile/putMyProfileInfo';

export const QueryMutationPutMyProfileInfo = (): UseMutationResult<
  ProfileMyInfo,
  AxiosError,
  PutMyProfileInfoReq
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_MY_PROFILE_INFO],
    mutationFn: (putMyProfileInfoReq: PutMyProfileInfoReq) =>
      putMyProfileInfo(putMyProfileInfoReq),
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_MY_PROFILE_INFO],
      });

      initMyAccountSettingInfo(data);
    },
  });
};
