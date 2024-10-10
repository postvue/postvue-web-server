import { privateApi } from 'services';
import { LOGOUT_API_PATH } from 'services/appApiPath';

export async function postAuthLogout(): Promise<string> {
  try {
    const data = await privateApi.post(LOGOUT_API_PATH);

    console.log(data.data);
    return data.data;
  } catch (err) {
    console.error(err);

    throw err;
  }
}
