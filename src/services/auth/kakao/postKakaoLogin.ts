import { AxiosError } from 'axios';
import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { api } from 'services';
import { KAKAO_LOGIN_API_PATH } from 'services/appApiPath';

interface AuthTokenRes {
  accessToken: string;
  refreshToken: string;
}

interface postKakaoLoginReq {
  kakaoAccessToken: string;
}

// Point 가져오기
export const postKakaoLogin = (
  kakaoAccessToken: string,
): Promise<AuthTokenRes> => {
  const data: postKakaoLoginReq = {
    kakaoAccessToken: kakaoAccessToken,
  };

  return api
    .post(KAKAO_LOGIN_API_PATH, data)
    .then((res) => {
      const authToken: AuthTokenRes = res.data.data;

      localStorage.setItem(ACCESS_TOKEN, authToken.accessToken);

      return authToken;
    })
    .catch((err: AxiosError) => {
      throw err;
    });
};
