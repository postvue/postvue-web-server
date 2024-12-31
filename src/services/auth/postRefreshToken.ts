import { refreshApi } from 'services';
import { AUTH_RENEWAL_TOKEN_API_PATH } from 'services/appApiPath';

interface AuthTokenRes {
  accessToken: string;
  refreshToken: string;
}

export const postRefreshToken = (): Promise<AuthTokenRes> => {
  return refreshApi
    .post(AUTH_RENEWAL_TOKEN_API_PATH)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
