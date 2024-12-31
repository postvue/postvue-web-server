// import axios from 'axios';

import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { api } from 'services';
import { EMAIL_LOGIN_API_PATH } from 'services/appApiPath';

interface AuthTokenRes {
  accessToken: string;
  refreshToken: string;
}

interface postEmailLoginReq {
  email: string;
  password: string;
}

// Point 가져오기
export const postEmailLogin = (
  email: string,
  password: string,
): Promise<AuthTokenRes> => {
  const data: postEmailLoginReq = {
    email: email,
    password: password,
  };

  return api
    .post(EMAIL_LOGIN_API_PATH, data)
    .then((res) => {
      const authToken: AuthTokenRes = res.data.data;

      localStorage.setItem(ACCESS_TOKEN, authToken.accessToken);

      return authToken;
    })
    .catch((err) => {
      throw err;
    });
};
