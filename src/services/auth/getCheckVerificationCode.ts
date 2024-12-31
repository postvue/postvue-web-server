import { api } from 'services';
import { AUTH_CHECK_SIGNUP_QUAL_API_PATH } from 'services/appApiPath';

export async function getCheckVerificationCode(): Promise<boolean> {
  return api
    .get(`${AUTH_CHECK_SIGNUP_QUAL_API_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
}
