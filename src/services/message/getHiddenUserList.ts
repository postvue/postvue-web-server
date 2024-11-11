import { privateApi } from '..';
import { MsgBlockHiddenUser } from '../../global/interface/message';
import { MESSAGE_PATH, MSG_HIDDEN_USER_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetHiddenUserListRsp {
  cursorId: string;
  hiddenUserList: MsgBlockHiddenUser[];
}

export const getHiddenUserList = (
  cursor: string,
): Promise<GetHiddenUserListRsp> => {
  return privateApi
    .get(
      `${MESSAGE_PATH}${MSG_HIDDEN_USER_LIST_PATH}?${CURSOR_PARAM}=${cursor}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
