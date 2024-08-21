import { api } from '..';
import { PutHiddeningUserRsp } from '../../global/interface/message';

import { MESSAGE_PATH, MSG_HIDDEN_USER_LIST_PATH } from '../appApiPath';

export const putHiddenUser = (
  targetUserId: string,
): Promise<PutHiddeningUserRsp> => {
  return api
    .put(`${MESSAGE_PATH}${MSG_HIDDEN_USER_LIST_PATH}/${targetUserId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
