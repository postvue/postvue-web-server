import { api } from '..';
import { BLOCK_LIST, PROFILE_LIST_PATH } from '../../const/PathConst';

export const deleteBlockUser = (blockedUserId: string): Promise<boolean> => {
  return api
    .delete(`${PROFILE_LIST_PATH}${BLOCK_LIST}/${blockedUserId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
