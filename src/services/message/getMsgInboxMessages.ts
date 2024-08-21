import { api } from '..';
import { MsgInboxMessage } from '../../global/interface/message';
import { MESSAGE_PATH, MSG_INBOX_FOLLOW_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetMsgInboxMessageRsp {
  cursorId: string;
  msgInboxMessageList: MsgInboxMessage[];
}

export const getMsgInboxMessages = (
  cursor: string,
): Promise<GetMsgInboxMessageRsp> => {
  return api
    .get(
      `${MESSAGE_PATH}${MSG_INBOX_FOLLOW_LIST_PATH}?${CURSOR_PARAM}=${cursor}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
