import { api } from '..';
import { PutBlockingUserRsp } from '../../global/interface/message';
import { MESSAGE_PATH, MSG_UNBLOCK_USER_LIST_PATH } from '../appApiPath';

export const putUnblockingUser = (
  targetUserId: string,
): Promise<PutBlockingUserRsp> => {
  return api
    .put(`${MESSAGE_PATH}${MSG_UNBLOCK_USER_LIST_PATH}/${targetUserId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
