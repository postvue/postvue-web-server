import { BLOCK_LIST_PATH } from 'services/appApiPath';
import { api } from '..';
import { PROFILE_LIST_PATH } from '../../const/PathConst';

export const createBlockUser = (blockedUserId: string): Promise<boolean> => {
  return api
    .post(`${PROFILE_LIST_PATH}${BLOCK_LIST_PATH}/${blockedUserId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
