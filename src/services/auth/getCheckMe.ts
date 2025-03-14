import { privateApi } from 'services';
import { AUTH_CHECK_ME_API_PATH } from 'services/appApiPath';

export async function getCheckMe(): Promise<boolean> {
  return privateApi
    .get(`${AUTH_CHECK_ME_API_PATH}`)
    .then((res) => {
      console.log(res.data);
      return true;
    })
    .catch((error) => {
      return false;
    });
}
