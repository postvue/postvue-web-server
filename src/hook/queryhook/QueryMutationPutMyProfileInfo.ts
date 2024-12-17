import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_MY_PROFILE_INFO,
  QUERY_STATE_PROFILE_ACCOUNT_INFO,
} from 'const/QueryClientConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { initMyAccountSettingInfo } from 'global/util/MyAccountSettingUtil';
import { putMyProfileInfo } from 'services/profile/putMyProfileInfo';

export const QueryMutationPutMyProfileInfo = (): UseMutationResult<
  ProfileMyInfo,
  AxiosError,
  FormData
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_MY_PROFILE_INFO],
    mutationFn: (formData: FormData) => putMyProfileInfo(formData),
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_MY_PROFILE_INFO],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_PROFILE_ACCOUNT_INFO],
      });

      initMyAccountSettingInfo(data);
    },
  });
};
