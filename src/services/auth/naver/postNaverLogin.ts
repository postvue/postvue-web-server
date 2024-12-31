// import axios from 'axios';

import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { api } from 'services';
import { NAVER_LOGIN_API_PATH } from 'services/appApiPath';

interface AuthTokenRes {
  accessToken: string;
  refreshToken: string;
}

interface postNaverLoginReq {
  naverAccessToken: string;
}

// Point 가져오기
export const postNaverLogin = (
  naverAccessToken: string,
): Promise<AuthTokenRes> => {
  const data: postNaverLoginReq = {
    naverAccessToken: naverAccessToken,
  };

  return api
    .post(NAVER_LOGIN_API_PATH, data)
    .then((res) => {
      const authToken: AuthTokenRes = res.data.data;

      localStorage.setItem(ACCESS_TOKEN, authToken.accessToken);

      return authToken;
    })
    .catch((err) => {
      throw err;
    });
};
