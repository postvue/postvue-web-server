import { api } from '..';
import { MsgBlockHiddenUser } from '../../global/interface/message';
import { BLOCK_LIST_PATH, MESSAGE_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetBlockUserListRsp {
  cursorId: string;
  blockUserList: MsgBlockHiddenUser[];
}

export const getMsgBlockedUserList = (
  cursor: string,
): Promise<GetBlockUserListRsp> => {
  return api
    .get(`${MESSAGE_PATH}${BLOCK_LIST_PATH}?${CURSOR_PARAM}=${cursor}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
