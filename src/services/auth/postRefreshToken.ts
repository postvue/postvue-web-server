import { CHANNEL_USER_ID } from 'const/LocalStorageConst';
import { AuthTokenRsp } from 'const/ReactNativeConst';
import { setAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import {
  isApp,
  stackRouterLoginSuccess,
} from 'global/util/reactnative/nativeRouter';
import { refreshApi } from 'services';
import { AUTH_RENEWAL_TOKEN_API_PATH } from 'services/appApiPath';

export const postRefreshToken = (): Promise<AuthTokenRsp> => {
  return refreshApi
    .post(AUTH_RENEWAL_TOKEN_API_PATH)
    .then((res) => {
      console.log(res.data);

      // 앱일 경우, auth 데이터 전달
      if (isApp()) {
        stackRouterLoginSuccess(res.data.data);
      }

      // localStorage에 저장
      const authToken: AuthTokenRsp = res.data.data;
      setAccessTokenToLocalStorage(authToken.accessToken);
      localStorage.setItem(CHANNEL_USER_ID, authToken.userId);

      return authToken;
    })
    .catch((error) => {
      throw error;
    });
};
