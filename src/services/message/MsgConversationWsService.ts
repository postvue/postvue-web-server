import { IMessage } from '@stomp/stompjs';

import { queryClient } from 'App';
import {
  QUERY_STATE_MSG_CONVERSATION_LIST,
  QUERY_STATE_MSG_INBOX_LIST,
} from 'const/QueryClientConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { MsgConversationListInterface } from 'hook/queryhook/QueryStateMsgConversationListInfinite';
import { MsgInboxListInterface } from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import {
  MsgConversation,
  MsgConversationWsCreatePub,
  MsgConversationWsSub,
  MsgConversationWsUpdatePub,
  MsgDeletedConversation,
} from '../../global/interface/message';
import webSocketService from '../WebSocketService';
import {
  API_MESSAGES_PATH,
  MESSAGES_BROKER_PATH,
} from '../websocketServicePath';
import { GetMsgConversationsRsp } from './getMsgConversationList';

export class MsgConversationWsService {
  connect(
    handleUnreadMsg: () => void,
    myAccountSeetingInterface: ProfileMyInfo,
  ): void {
    webSocketService.addOnInitializedCallback(() => {
      if (!myAccountSeetingInterface.userId)
        throw new Error('user id is not existed');

      webSocketService.setSubscribe(
        `${MESSAGES_BROKER_PATH}/${myAccountSeetingInterface.userId}`,
        (message: IMessage) => {
          const msgConversationSub: MsgConversationWsSub = JSON.parse(
            message.body,
          ) as MsgConversationWsSub;

          if (msgConversationSub.isDeleted) {
            this.onHandleDeletedMsg({
              msgId: msgConversationSub.msgId,
              msgRoomId: msgConversationSub.msgRoomId,
              isGroupedMsg: msgConversationSub.isGroupedMsg,
              targetUserId: msgConversationSub.targetUserId,
              sourceUserId: msgConversationSub.sourceUserId,
            });
          } else {
            const msgConversation: MsgConversation = {
              isOtherMsg:
                msgConversationSub.sourceUserId !==
                myAccountSeetingInterface.userId,
              msgId: msgConversationSub.msgId,
              msgRoomId: msgConversationSub.msgRoomId,
              isGroupedMsg: msgConversationSub.isGroupedMsg,
              targetUserId: msgConversationSub.targetUserId,
              msgType: msgConversationSub.msgType,
              msgContent: msgConversationSub.msgContent,
              hasMsgReaction: msgConversationSub.hasMsgReaction,
              msgReactionType: msgConversationSub.msgReactionType,
              sendAt: msgConversationSub.sendAt,
            };
            this.onHandleSendedMsg(msgConversation, handleUnreadMsg);
          }
        },
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

  deleteMessage(msgConversationId: string): void {
    const destination = `${API_MESSAGES_PATH}/delete/${msgConversationId}`;
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

  onHandleSendedMsg = async (
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
              return {
                ...msgInboxMessage,
                msgType: message.msgType,
                msgContent: message.msgContent,
                unreadCount: msgInboxMessage.unreadCount + 1,
                sendAt: message.sendAt,
              };
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
