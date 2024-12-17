import { refreshApi } from 'services';
import { AUTH_RENEWAL_TOKEN_API_PATH } from 'services/appApiPath';

interface PostRefreshRes {
  accessToken: string;
  status: number;
}

export async function postRefreshToken(): Promise<PostRefreshRes> {
  const response = await refreshApi.post(AUTH_RENEWAL_TOKEN_API_PATH);

  return {
    accessToken: response.data.data,
    status: response.status,
  };
}
