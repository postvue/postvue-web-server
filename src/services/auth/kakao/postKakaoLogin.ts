import { AxiosError } from 'axios';
import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { api } from 'services';
import { KAKAO_LOGIN_API_PATH } from 'services/appApiPath';

interface postKakaoLoginRes {
  data: string;
  statusCode: string;
  message: string;
}

interface postKakaoLoginReq {
  kakaoAccessToken: string;
}

// Point 가져오기
export const postKakaoLogin = (
  kakaoAccessToken: string,
): Promise<postKakaoLoginRes> => {
  const data: postKakaoLoginReq = {
    kakaoAccessToken: kakaoAccessToken,
  };

  return api
    .post(KAKAO_LOGIN_API_PATH, data)
    .then((res) => {
      const accessToken = res.data.data;

      localStorage.setItem(ACCESS_TOKEN, accessToken);

      return res.data;
    })
    .catch((err: AxiosError) => {
      throw err;
    });
};
