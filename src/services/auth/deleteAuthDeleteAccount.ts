import { privateApi } from 'services';
import { AUTH_MEMBER_WITHDRAWAL_API_PATH } from 'services/appApiPath';

export const deleteAuthDeleteAccount = (): Promise<string> => {
  return privateApi
    .delete(AUTH_MEMBER_WITHDRAWAL_API_PATH)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
