import { SignupEmailInfo } from 'global/interface/signup';
import { api } from 'services';
import { SIGNUP_EMAIL_API_PATH } from 'services/appApiPath';

export async function postAuthSignupEmail(
  signupEmailReq: SignupEmailInfo,
): Promise<string> {
  try {
    const data = await api.post(SIGNUP_EMAIL_API_PATH, signupEmailReq);

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.error(err);

    throw err;
  }
}
