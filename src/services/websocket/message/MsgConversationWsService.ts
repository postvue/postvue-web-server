import { IMessage } from '@stomp/stompjs';

import { queryClient } from 'App';
import {
  QUERY_STATE_MSG_CONVERSATION_LIST,
  QUERY_STATE_MSG_INBOX_LIST,
} from 'const/QueryClientConst';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { MsgConversationListInterface } from 'hook/queryhook/QueryStateMsgConversationListInfinite';
import { MsgInboxListInterface } from 'hook/queryhook/QueryStateMsgInboxListInfinite';

import {
  WEBSOCKET_BROADCAST_MESSAGE_TYPES,
  websocketBroadcastChannel,
  WebsocketBroadcastMessage,
} from 'config/appconfig/WebSocketBroadcastChannelConfig';
import {
  BRIDGE_EVENT_WEBSOCKET_CHANNEL_TYPE,
  BridgeMsgInterface,
  EVENT_WEBSOCKET_CHANNEL_MSG_CONVERSATION_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import {
  MsgConversation,
  MsgConversationWsCreatePub,
  MsgConversationWsSub,
  MsgConversationWsUpdatePub,
  MsgDeletedConversation,
  MsgInboxMessage,
} from 'global/interface/message';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import { GetMsgConversationsRsp } from 'services/message/getMsgConversationList';
import webSocketService from '../WebSocketService';
import {
  API_MESSAGES_PATH,
  MESSAGES_BROKER_PATH,
} from '../websocketServicePath';
import {
  MSG_CONVERSATION_SUB_CREATE_EVENT_TYPE,
  MSG_CONVERSATION_SUB_DELETE_EVENT_TYPE,
  MSG_CONVERSATION_SUB_ERROR_EVENT_TYPE,
} from './MsgConversationSubEventType';

export class MsgConversationWsService {
  private desination: string | null = null;
  private channelUserId: string | null = null;
  private handleUnreadMsg: (() => void) | null = null;

  connect(channelUserId: string, handleUnreadMsg: () => void): void {
    this.channelUserId = channelUserId;
    this.handleUnreadMsg = handleUnreadMsg;

    // 웹앱 인지 확인
    if (webSocketService === null || isApp()) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

          if (nativeEvent.type === BRIDGE_EVENT_WEBSOCKET_CHANNEL_TYPE) {
            const eventData: EventDateInterface = nativeEvent.data;
            const desination = eventData.path;
            const data = eventData.data;

            if (
              eventData.eventType ===
              EVENT_WEBSOCKET_CHANNEL_MSG_CONVERSATION_TYPE
            ) {
              const msgConversationSub: MsgConversationWsSub = JSON.parse(
                data,
              ) as MsgConversationWsSub;

              this.procssMsgAndBroadcast(msgConversationSub);
            }
          }
        } catch (error) {
          console.error('Failed to parse message:', event.data);
        }
      };

      useMessageListener(handleMessage);
    } else {
      webSocketService.addOnInitializedCallback(() => {
        if (!channelUserId) throw new Error('user id is not existed');
        if (webSocketService === null || isApp()) return;

        this.desination = `${MESSAGES_BROKER_PATH}/${channelUserId}`;
        webSocketService.setSubscribe(this.desination, (message: IMessage) => {
          const msgConversationSub: MsgConversationWsSub = JSON.parse(
            message.body,
          ) as MsgConversationWsSub;

          this.procssMsgAndBroadcast(msgConversationSub);
        });
      });
    }
  }

  private procssMsgAndBroadcast(
    msgConversationSub: MsgConversationWsSub,
  ): void {
    this.processMsg(msgConversationSub);
    websocketBroadcastChannel.postMessage({
      type: WEBSOCKET_BROADCAST_MESSAGE_TYPES.WEBSOCKET_CHANNEL_MSG_CONVERSATION_TYPE,
      data: msgConversationSub,
    } as WebsocketBroadcastMessage);
  }

  processMsg(msgConversationSub: MsgConversationWsSub): void {
    if (this.channelUserId === null || this.handleUnreadMsg === null) return;

    if (
      msgConversationSub.eventType === MSG_CONVERSATION_SUB_ERROR_EVENT_TYPE
    ) {
      alert(msgConversationSub.errorMsg);
      console.error(msgConversationSub.errorMsg);
      return;
    } else if (
      msgConversationSub.eventType === MSG_CONVERSATION_SUB_CREATE_EVENT_TYPE
    ) {
      const msgConversation: MsgConversation = {
        isOtherMsg: msgConversationSub.sourceUserId !== this.channelUserId,
        msgId: msgConversationSub.msgId,
        msgRoomId: msgConversationSub.msgRoomId,
        isGroupedMsg: msgConversationSub.isGroupedMsg,
        targetUserId: msgConversationSub.targetUserId,
        msgTextContent: msgConversationSub.msgTextContent,
        hasMsgMedia: msgConversationSub.hasMsgMedia,
        msgMediaType: msgConversationSub.msgMediaType,
        msgMediaContent: msgConversationSub.msgMediaContent,
        hasMsgReaction: msgConversationSub.hasMsgReaction,
        msgReactionType: msgConversationSub.msgReactionType,
        msgLinkMetaInfo: msgConversationSub.msgLinkMetaInfo,
        sendAt: msgConversationSub.sendAt,
      };
      this.onHandleSendedMsg(msgConversation, this.handleUnreadMsg);
    } else if (
      msgConversationSub.eventType === MSG_CONVERSATION_SUB_DELETE_EVENT_TYPE
    ) {
      this.onHandleDeletedMsg({
        msgId: msgConversationSub.msgId,
        msgRoomId: msgConversationSub.msgRoomId,
        isGroupedMsg: msgConversationSub.isGroupedMsg,
        targetUserId: msgConversationSub.targetUserId,
        sourceUserId: msgConversationSub.sourceUserId,
      });
      return;
    } else {
      console.error('관련 없는 메시지 입니다.');
      return;
    }
  }

  sendMessage(targetUserId: string, message: MsgConversationWsCreatePub): void {
    const destination = `${API_MESSAGES_PATH}/create/${targetUserId}`;
    if (webSocketService === null) {
      if (!isApp()) return;
      // @REFER: 모바일 개발 시, 추가하도록
      ('');
    } else {
      webSocketService.publishMessage(destination, JSON.stringify(message));
    }
  }

  updateMessage(
    msgSessionId: string,
    message: MsgConversationWsUpdatePub,
  ): void {
    const destination = `${API_MESSAGES_PATH}/update/${msgSessionId}`;
    if (webSocketService === null) {
      if (!isApp()) return;
      // @REFER: 모바일 개발 시, 추가하도록
      ('');
    } else {
      webSocketService.publishMessage(
        destination,
        JSON.stringify({ ...message, action: 'update' }),
      );
    }
  }

  deleteMessage(msgConversationId: string): void {
    const destination = `${API_MESSAGES_PATH}/delete/${msgConversationId}`;
    if (webSocketService === null) {
      if (!isApp()) return;
      // @REFER: 모바일 개발 시, 추가하도록
      ('');
    } else {
      webSocketService.publishMessage(
        destination,
        JSON.stringify({ action: 'delete' }),
      );
    }
  }

  disconnect(): void {
    if (this.desination === null) return;
    if (webSocketService === null || isApp()) return;
    if (webSocketService.isWebSocketInitialized()) {
      webSocketService.deleteSubscribe(this.desination);
    }
  }

  onHandleDeletedMsg = async (
    deletedMessage: MsgDeletedConversation,
  ): Promise<void> => {
    if (deletedMessage.isGroupedMsg) return;
    queryClient.setQueryData(
      [
        convertQueryTemplate(
          QUERY_STATE_MSG_CONVERSATION_LIST,
          deletedMessage.targetUserId,
        ),
      ],
      (oldData: MsgConversationListInterface) => {
        // 페이지 별로 요소 삭제
        if (!oldData) {
          return oldData;
        }
        const updatedPages = oldData.pages.map((page) => {
          return {
            ...page,
            msgConversationRspList: page.msgConversationRspList.filter(
              (value) => value.msgId !== deletedMessage.msgId,
            ), // 특정 ID를 가진 요소 제거
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      },
    );
  };

  private onHandleSendedMsg = async (
    message: MsgConversation,
    handleUnreadMsg: () => void,
  ): Promise<void> => {
    if (message.isGroupedMsg) return;
    queryClient.setQueryData(
      [
        convertQueryTemplate(
          QUERY_STATE_MSG_CONVERSATION_LIST,
          message.targetUserId,
        ),
      ],
      (oldData: MsgConversationListInterface) => {
        if (!oldData) {
          return oldData;
        }
        const updatedPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            // 첫 번째 페이지에 새로운 아이템을 추가
            return {
              ...page,
              msgConversationRspList: [message, ...page.msgConversationRspList], // 맨 앞에 새로운 아이템 추가
            } as GetMsgConversationsRsp;
          }
          return page;
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      },
    );

    queryClient.setQueryData(
      [QUERY_STATE_MSG_INBOX_LIST],
      (oldData: MsgInboxListInterface) => {
        if (!oldData) {
          return oldData;
        }

        const newPages = oldData.pages.map((page) => {
          return page.map((msgInboxMessage) => {
            // 특정 조건을 만족하는 메시지를 수정
            if (msgInboxMessage.targetUserId === message.targetUserId) {
              // 예: targetUserId를 기준으로 수정
              const msgInbox: MsgInboxMessage = {
                ...msgInboxMessage,
                msgTextContent: message.msgTextContent,
                hasMsgMedia: message.hasMsgMedia,
                msgMediaType: message.msgMediaType,
                msgMediaContent: message.msgMediaContent,
                unreadCount: msgInboxMessage.unreadCount + 1,
                sendAt: message.sendAt,
              };
              return msgInbox;
            }
            return msgInboxMessage; // 조건에 맞지 않으면 원본 메시지를 반환
          });
        });

        // 조건을 만족하는 페이지를 찾고 나머지 페이지와 나눔
        const matchedPages = newPages.map((page) => {
          return page.filter((v) => v.targetUserId === message.targetUserId);
        });

        const otherPages = newPages.map((page) => {
          return page.filter((v) => v.targetUserId !== message.targetUserId);
        });

        return {
          ...oldData,
          pages: [...matchedPages, ...otherPages],
        };
      },
    );

    handleUnreadMsg();
  };
}

const msgConversationWsService = new MsgConversationWsService();
export default msgConversationWsService;
