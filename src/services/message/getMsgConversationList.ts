import { api } from '..';
import { MsgConversation } from '../../global/interface/message';
import { MESSAGE_PATH, MSG_CONVERSATION_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM, TARGET_USER_ID_PARAM } from '../appApiQueryParam';

interface GetMsgConversationsRsp {
  cursorId: string;
  msgConversationRspList: MsgConversation[];
}

export const getMsgConversationList = (
  cursorId: string,
  targetUserId: string,
): Promise<GetMsgConversationsRsp> => {
  return api
    .get(
      `${MESSAGE_PATH}${MSG_CONVERSATION_LIST_PATH}?${TARGET_USER_ID_PARAM}=${targetUserId}&${CURSOR_PARAM}=${cursorId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
