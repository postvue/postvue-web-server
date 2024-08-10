import { IMessage } from '@stomp/stompjs';
import {
  MsgConversation,
  MsgConversationWsCreatePub,
  MsgConversationWsSub,
  MsgConversationWsUpdatePub,
} from '../../global/interface/message';
import { FollowProfileInfo } from '../../global/interface/profile';
import { MESSAGE_PATH } from '../appApiPath';
import { WebSocketService } from '../WebSocketService';
import {
  APP_MESSAGE_CONVERSATIONS_PATH,
  MESSAGE_BROKER_PATH,
  WEBSOCKET_APPLICATION_PATH,
} from '../websocketServicePath';

export class MsgConversationWsService extends WebSocketService {
  constructor() {
    super();
  }

  protected getSocketUrl(): string {
    return `${WEBSOCKET_APPLICATION_PATH}`; // @REFER: 현재 프록시 서버로 주소를 변환해서 연결하기 때문에 느림
  }

  connect(
    followInfo: FollowProfileInfo,
    onMessage: (message: MsgConversation) => void,
    onDeleteMessage: (messageId: string) => void,
  ): void {
    this.client.onConnect = (frame) => {
      this.client.subscribe(
        `${MESSAGE_BROKER_PATH}${APP_MESSAGE_CONVERSATIONS_PATH}/${followInfo.msgSessionId}`,
        (message: IMessage) => {
          const msgConversationSub: MsgConversationWsSub = JSON.parse(
            message.body,
          ) as MsgConversationWsSub;

          if (msgConversationSub.isDeleted) {
            onDeleteMessage(msgConversationSub.msgId);
          } else {
            const msgConversation: MsgConversation = {
              isFollowMsg: !(
                msgConversationSub.userId !== followInfo.followUserId
              ),
              msgId: msgConversationSub.msgId,
              msgType: msgConversationSub.msgType,
              msgContent: msgConversationSub.msgContent,
              hasMsgReaction: msgConversationSub.hasMsgReaction,
              msgReactionType: msgConversationSub.msgReactionType,
              isRead: msgConversationSub.isRead,
              sendAt: msgConversationSub.sendAt,
            };
            onMessage(msgConversation);
          }
        },
      );
    };
    this.client.activate();
  }

  sendMessage(msgSessionId: string, message: MsgConversationWsCreatePub): void {
    const destination = `${MESSAGE_PATH}${WEBSOCKET_APPLICATION_PATH}/create${APP_MESSAGE_CONVERSATIONS_PATH}/${msgSessionId}`;
    this.client.publish({ destination, body: JSON.stringify(message) });
  }

  updateMessage(
    msgSessionId: string,
    message: MsgConversationWsUpdatePub,
  ): void {
    const destination = `${MESSAGE_PATH}${WEBSOCKET_APPLICATION_PATH}/update${APP_MESSAGE_CONVERSATIONS_PATH}/${msgSessionId}`;
    this.client.publish({
      destination,
      body: JSON.stringify({ ...message, action: 'update' }),
    });
  }

  deleteMessage(msgSessionId: string, msgConversationId: string): void {
    const destination = `${MESSAGE_PATH}${WEBSOCKET_APPLICATION_PATH}/delete${APP_MESSAGE_CONVERSATIONS_PATH}/${msgSessionId}/${msgConversationId}`;
    this.client.publish({
      destination,
      body: JSON.stringify({ action: 'delete' }),
    });
  }
}

const msgConversationWsService = new MsgConversationWsService();
export default msgConversationWsService;
