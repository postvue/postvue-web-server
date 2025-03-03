// import axios from 'axios';

import { CHANNEL_USER_ID } from 'const/LocalStorageConst';
import { AuthTokenRsp } from 'const/ReactNativeConst';
import { setAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { api } from 'services';
import { EMAIL_LOGIN_API_PATH } from 'services/appApiPath';

interface postEmailLoginReq {
  email: string;
  password: string;
}

// Point 가져오기
export const postEmailLogin = (
  email: string,
  password: string,
): Promise<AuthTokenRsp> => {
  const data: postEmailLoginReq = {
    email: email,
    password: password,
  };

  return api
    .post(EMAIL_LOGIN_API_PATH, data)
    .then((res) => {
      const authToken: AuthTokenRsp = res.data.data;

      setAccessTokenToLocalStorage(authToken.accessToken);
      localStorage.setItem(CHANNEL_USER_ID, authToken.userId);

      return authToken;
    })
    .catch((err) => {
      throw err;
    });
};
