// import axios from 'axios';

import { CHANNEL_USER_ID } from 'const/LocalStorageConst';
import { AuthTokenRsp } from 'const/ReactNativeConst';
import { setAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { api } from 'services';
import { GOOGLE_LOGIN_API_PATH } from 'services/appApiPath';

interface postNaverLoginReq {
  idToken: string;
}

// Point 가져오기
export const postGoogleLogin = (idToken: string): Promise<AuthTokenRsp> => {
  const data: postNaverLoginReq = {
    idToken: idToken,
  };

  return api
    .post(GOOGLE_LOGIN_API_PATH, data)
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
