import { privateApi } from '..';
import { PutBlockingUserRsp } from '../../global/interface/message';
import { BLOCK_LIST_PATH, MESSAGE_PATH } from '../appApiPath';

export const putBlockingUser = (
  targetUserId: string,
): Promise<PutBlockingUserRsp> => {
  return privateApi
    .put(`${MESSAGE_PATH}${BLOCK_LIST_PATH}/${targetUserId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
