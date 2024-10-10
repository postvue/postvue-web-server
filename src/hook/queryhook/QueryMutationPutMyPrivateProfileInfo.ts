import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import { notify } from 'components/popups/ToastMsgPopup';
import {
  QUERY_STATE_MY_PROFILE_INFO,
  QUERY_STATE_PROFILE_ACCOUNT_BIRTHDATE_INFO,
} from 'const/QueryClientConst';
import { SETTING_EDIT_COMPLETE_PHASE_TEXT } from 'const/SystemPhraseConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { initMyAccountSettingInfo } from 'global/util/MyAccountSettingUtil';
import {
  putMyPrivateProfileInfo,
  PutMyPrivateProfileInfoReq,
} from 'services/profile/putMyPrivateProfileInfo';

export const QueryMutationPutMyPrivateProfileInfo = (): UseMutationResult<
  ProfileMyInfo,
  AxiosError,
  PutMyPrivateProfileInfoReq
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_PROFILE_ACCOUNT_BIRTHDATE_INFO],
    mutationFn: (putMyPrivateProfileInfoReq: PutMyPrivateProfileInfoReq) =>
      putMyPrivateProfileInfo(putMyPrivateProfileInfoReq),
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_MY_PROFILE_INFO],
      });

      initMyAccountSettingInfo(data);

      notify(SETTING_EDIT_COMPLETE_PHASE_TEXT);
    },
  });
};
