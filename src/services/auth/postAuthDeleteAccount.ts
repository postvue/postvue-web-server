import { privateApi } from 'services';
import { AUTH_MEMBER_WITHDRAWAL_API_PATH } from 'services/appApiPath';

export interface AuthMemberWithdrawalReq {
  appleAuthorizationCode?: string;
}

export const postAuthDeleteAccount = (
  authMemberWithdrawalReq: AuthMemberWithdrawalReq,
): Promise<string> => {
  return privateApi
    .post(AUTH_MEMBER_WITHDRAWAL_API_PATH, authMemberWithdrawalReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
