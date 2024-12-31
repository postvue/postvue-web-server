import { api } from 'services';
import { SIGNUP_VERIFY_EMAIL_API_PATH } from 'services/appApiPath';

export interface SignupEmailVerifyInfo {
  verificationCode: string;
}

export async function postAuthSignupVerifyEmail(
  signupEmailReq: SignupEmailVerifyInfo,
): Promise<string> {
  try {
    const data = await api.post(SIGNUP_VERIFY_EMAIL_API_PATH, signupEmailReq);

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.error(err);

    throw err;
  }
}
