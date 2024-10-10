import { refreshApi } from 'services';
import { AUTH_RENEWAL_TOKEN_API_PATH } from 'services/appApiPath';

interface PostRefreshRes {
  accessToken: string;
  status: number;
}

export async function postRefreshToken(): Promise<PostRefreshRes> {
  try {
    const response = await refreshApi.post(AUTH_RENEWAL_TOKEN_API_PATH);

    console.log('리프레쉬');
    return {
      accessToken: response.data.data,
      status: response.status,
    };
  } catch (err) {
    console.error(err);

    throw err;
  }
}
