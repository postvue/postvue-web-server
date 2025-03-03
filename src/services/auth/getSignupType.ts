import { privateApi } from 'services';
import { SIGNUP_TYPE_API_PATH } from 'services/appApiPath';

export async function getSignupType(): Promise<string> {
  return privateApi
    .get(`${SIGNUP_TYPE_API_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
}
