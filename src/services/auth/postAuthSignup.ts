import { SignupInfo } from 'global/interface/signup';
import { refreshApi } from 'services';
import { SIGNUP_API_PATH } from 'services/appApiPath';

export async function postAuthSignup(
  signupUserInfoReq: SignupInfo,
): Promise<string> {
  try {
    const data = await refreshApi.post(SIGNUP_API_PATH, signupUserInfoReq);

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.error(err);

    throw err;
  }
}
