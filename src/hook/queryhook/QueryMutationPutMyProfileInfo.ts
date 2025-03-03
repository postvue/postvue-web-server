import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_STATE_MY_PROFILE_INFO } from 'const/QueryClientConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { fetchMyProfileInfo } from 'global/util/channel/static/fetchMyProfileInfo';
import { fetchProfileAccountInfo } from 'global/util/channel/static/fetchProfileAccountInfo';
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
      fetchMyProfileInfo();
      fetchProfileAccountInfo(data.username);

      initMyAccountSettingInfo(data);
    },
  });
};
