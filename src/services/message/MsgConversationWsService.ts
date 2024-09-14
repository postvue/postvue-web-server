import { IMessage } from '@stomp/stompjs';
import { MyAccountSettingInterface } from '../../global/interface/localstorage/MyAccountSettingInterface';
import {
  MsgConversation,
  MsgConversationWsCreatePub,
  MsgConversationWsSub,
  MsgConversationWsUpdatePub,
} from '../../global/interface/message';
import webSocketService from '../WebSocketService';
import {
  API_MESSAGES_PATH,
  MESSAGES_BROKER_PATH,
} from '../websocketServicePath';

export class MsgConversationWsService {
  connect(
    onMessage: (message: MsgConversation) => void,
    onDeleteMessage: (messageId: string) => void,
    setSessionId: React.Dispatch<React.SetStateAction<string>>,
    myAccountSeetingInterface: MyAccountSettingInterface,
  ): void {
    webSocketService.addOnInitializedCallback(() => {
      webSocketService.setSubscribe(
        `${MESSAGES_BROKER_PATH}/${myAccountSeetingInterface.userId}`,
        (message: IMessage) => {
          const msgConversationSub: MsgConversationWsSub = JSON.parse(
            message.body,
          ) as MsgConversationWsSub;

          if (msgConversationSub.isDeleted) {
            onDeleteMessage(msgConversationSub.msgId);
          } else {
            const msgConversation: MsgConversation = {
              isFollowMsg:
                msgConversationSub.userId !== myAccountSeetingInterface.userId,
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
        setSessionId,
      );
    });
  }

  sendMessage(targetUserId: string, message: MsgConversationWsCreatePub): void {
    const destination = `${API_MESSAGES_PATH}/create/${targetUserId}`;
    webSocketService.publishMessage(destination, JSON.stringify(message));
  }

  updateMessage(
    msgSessionId: string,
    message: MsgConversationWsUpdatePub,
  ): void {
    const destination = `${API_MESSAGES_PATH}/update/${msgSessionId}`;
    webSocketService.publishMessage(
      destination,
      JSON.stringify({ ...message, action: 'update' }),
    );
  }

  deleteMessage(targetUserId: string, msgConversationId: string): void {
    const destination = `${API_MESSAGES_PATH}/delete/${targetUserId}/${msgConversationId}`;
    webSocketService.publishMessage(
      destination,
      JSON.stringify({ action: 'delete' }),
    );
  }

  disconnect(sessionId: string): void {
    if (webSocketService.isWebSocketInitialized()) {
      webSocketService.deleteSubscribe(sessionId);
    }
  }
}

const msgConversationWsService = new MsgConversationWsService();
export default msgConversationWsService;
