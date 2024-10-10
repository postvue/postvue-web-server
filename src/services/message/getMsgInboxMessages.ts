import { privateApi } from '..';
import { MsgInboxMessage } from '../../global/interface/message';
import { MSG_CONVERATION_INBOX_LIST_API_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetMsgInboxMessageRsp {
  cursorId: string;
  msgInboxMessageList: MsgInboxMessage[];
}

export const getMsgInboxMessages = (
  cursor: string,
): Promise<GetMsgInboxMessageRsp> => {
  return privateApi
    .get(`${MSG_CONVERATION_INBOX_LIST_API_PATH}?${CURSOR_PARAM}=${cursor}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
