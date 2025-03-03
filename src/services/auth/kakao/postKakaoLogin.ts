import { AxiosError } from 'axios';
import { CHANNEL_USER_ID } from 'const/LocalStorageConst';
import { AuthTokenRsp } from 'const/ReactNativeConst';
import { setAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { api } from 'services';
import { KAKAO_LOGIN_API_PATH } from 'services/appApiPath';

interface postKakaoLoginReq {
  kakaoAccessToken: string;
}

// Point 가져오기
export const postKakaoLogin = (
  kakaoAccessToken: string,
): Promise<AuthTokenRsp> => {
  const data: postKakaoLoginReq = {
    kakaoAccessToken: kakaoAccessToken,
  };

  return api
    .post(KAKAO_LOGIN_API_PATH, data)
    .then((res) => {
      const authToken: AuthTokenRsp = res.data.data;

      setAccessTokenToLocalStorage(authToken.accessToken);
      localStorage.setItem(CHANNEL_USER_ID, authToken.userId);

      return authToken;
    })
    .catch((err: AxiosError) => {
      throw err;
    });
};
