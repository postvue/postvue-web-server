import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import { notify } from 'components/popups/ToastMsgPopup';
import {
  QUERY_STATE_MY_PROFILE_INFO,
  QUERY_STATE_PROFILE_ACCOUNT_GENDER_INFO,
} from 'const/QueryClientConst';
import { SETTING_EDIT_COMPLETE_PHASE_TEXT } from 'const/SystemPhraseConst';
import { ProfileMyInfo } from 'global/interface/profile';
import {
  putMyProfileGenderInfo,
  PutMyProfileGenderInfoReq,
} from 'services/profile/putMyProfileGenderInfo';

export const QueryMutationPutMyProfileGenderInfo = (): UseMutationResult<
  ProfileMyInfo,
  AxiosError,
  PutMyProfileGenderInfoReq
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_PROFILE_ACCOUNT_GENDER_INFO],
    mutationFn: (putMyProfileGenderInfoReq: PutMyProfileGenderInfoReq) =>
      putMyProfileGenderInfo(putMyProfileGenderInfoReq),
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_STATE_MY_PROFILE_INFO],
      });

      // initMyAccountSettingInfo(data);
      notify({ msgTitle: SETTING_EDIT_COMPLETE_PHASE_TEXT });
    },
  });
};
