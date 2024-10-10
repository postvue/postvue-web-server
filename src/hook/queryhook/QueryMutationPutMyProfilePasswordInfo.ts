import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notify } from 'components/popups/ToastMsgPopup';
import { PROFILE_SETTING_PATH } from 'const/PathConst';
import { QUERY_STATE_PROFILE_ACCOUNT_EMAIL_INFO } from 'const/QueryClientConst';
import { SETTING_EDIT_COMPLETE_PHASE_TEXT } from 'const/SystemPhraseConst';
import { ProfileAccessToken } from 'global/interface/profile';
import { setAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { useGoBackOrNavigate } from 'global/util/historyStateUtil';
import {
  putMyProfilePasswordInfo,
  PutMyProfilePasswordInfoReq,
} from 'services/profile/putMyProfiloPasswordInfo';

export const QueryMutationPutMyProfilePasswordInfo = (): UseMutationResult<
  ProfileAccessToken,
  AxiosError,
  PutMyProfilePasswordInfoReq
> => {
  const goBackOrNavigate = useGoBackOrNavigate(PROFILE_SETTING_PATH);
  return useMutation({
    mutationKey: [QUERY_STATE_PROFILE_ACCOUNT_EMAIL_INFO],
    mutationFn: (putMyProfilePasswordInfoReq: PutMyProfilePasswordInfoReq) =>
      putMyProfilePasswordInfo(putMyProfilePasswordInfoReq),
    onSuccess(data) {
      setAccessTokenToLocalStorage(data.accessToken);
      goBackOrNavigate();
      notify(SETTING_EDIT_COMPLETE_PHASE_TEXT);
    },
  });
};
