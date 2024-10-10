// import axios from 'axios';

import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { api } from 'services';
import { NAVER_LOGIN_API_PATH } from 'services/appApiPath';

interface postNaverLoginRes {
  data: string;
  statusCode: string;
  message: string;
}

interface postNaverLoginReq {
  naverAccessToken: string;
}

// Point 가져오기
export const postNaverLogin = (
  naverAccessToken: string,
): Promise<postNaverLoginRes> => {
  const data: postNaverLoginReq = {
    naverAccessToken: naverAccessToken,
  };

  return api
    .post(NAVER_LOGIN_API_PATH, data)
    .then((res) => {
      const accessToken = res.data.data;

      localStorage.setItem(ACCESS_TOKEN, accessToken);

      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
