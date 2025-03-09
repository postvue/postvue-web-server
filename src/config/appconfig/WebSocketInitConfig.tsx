import { CHANNEL_USER_ID } from 'const/LocalStorageConst';
import { MESSAGE_SCROLL_TO_END_ACTION } from 'const/MessageConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { useLocalStorageListener } from 'hook/customhook/useLocalStorageLister';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import { useActiveUserSessionHookByIndexedDb } from 'hook/db/useActiveUserSessionHookByIndexedDb';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import React, { useEffect } from 'react';
import { useRecoilCallback } from 'recoil';
import { postRefreshToken } from 'services/auth/postRefreshToken';
import msgConversationWsService from 'services/websocket/message/MsgConversationWsService';
import notificationWsService from 'services/websocket/notification/NotificationWsService';
import notificationWsServiceByNative from 'services/websocket/notification/NotificationWsServiceByNative';
import sessionWsService from 'services/websocket/session/SessionWsService';
import sessionWsServiceByNative from 'services/websocket/session/SessionWsServiceByNative';
import {
  msgConversationScrollInfoAtom,
  sendedMsgListInfoAtom,
} from 'states/MessageAtom';
import webSocketService from '../../services/websocket/WebSocketService';

const WebSocketInitConfig: React.FC = () => {
  const channelUserId = useLocalStorageListener(CHANNEL_USER_ID);
  const { putNotifications } = useSnsNotificationHookByIndexedDb();
  const { putActiveUserSessions } = useActiveUserSessionHookByIndexedDb();

  // const [notificationMsgHashMap, setNotificationMsgHashMap] = useRecoilState(
  //   notificationMsgHashMapAtom,
  // );

  const handleUnreadMsg = useRecoilCallback(({ snapshot, set }) => async () => {
    const msgConversationScrollInfo = await snapshot.getPromise(
      msgConversationScrollInfoAtom,
    );

    if (
      msgConversationScrollInfo.currentPostion <
      msgConversationScrollInfo.maxScrollPosition
    ) {
      set(sendedMsgListInfoAtom, (prev) => ({
        ...prev,
        unreadMsgNum: prev.unreadMsgNum + 1,
      }));
    } else {
      set(sendedMsgListInfoAtom, (prev) => ({
        ...prev,
        unreadMsgNum: 0,
        action: MESSAGE_SCROLL_TO_END_ACTION,
      }));
    }
  });

  if (isApp()) {
    const handleMsgByNotifications =
      notificationWsServiceByNative.handleMsg(putNotifications);

    const handleMsgBySessions = sessionWsServiceByNative.handleByMsg(
      putActiveUserSessions,
    );
    useMessageListener((e) => {
      handleMsgByNotifications(e);
    });
    useMessageListener((e) => {
      handleMsgBySessions(e);
    });
  }

  useEffect(() => {
    // 앱일 경우
    if (webSocketService !== null && !isApp()) {
      if (!channelUserId) {
        postRefreshToken().catch(() => {
          ('');
        });
        return;
      }

      if (!webSocketService.isWebSocketInitialized()) {
        // 웹소켓 생성
        webSocketService.activateConnect();

        // 채널 등록
        sessionWsService.connect(channelUserId, putActiveUserSessions);

        notificationWsService.connect(channelUserId, putNotifications);

        msgConversationWsService.connect(channelUserId, handleUnreadMsg);
      }
    }

    return () => {
      if (webSocketService === null || isApp()) return;
      if (webSocketService.isWebSocketInitialized()) {
        sessionWsService.disconnect();
        notificationWsService.disconnect();
        msgConversationWsService.disconnect();
        webSocketService.disconnect();
      }
    };
  }, [channelUserId]);

  return <></>;
};

export default WebSocketInitConfig;
