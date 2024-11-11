import { privateApi } from '..';
import { MsgDirectConversationRsp } from '../../global/interface/message';
import { MESSAGE_PATH, MSG_CONVERSATION_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM, TARGET_USER_ID_PARAM } from '../appApiQueryParam';

export interface GetMsgConversationsRsp {
  cursorId: string;
  msgConversationRspList: MsgDirectConversationRsp[];
}

export const getDirectMsgConversationList = (
  targetUserId: string,
  cursorId: string,
): Promise<GetMsgConversationsRsp> => {
  return privateApi
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
