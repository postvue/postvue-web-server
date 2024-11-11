import { MESSAGE_SCROLL_TO_END_ACTION } from 'const/MessageConst';
import {
  getLastNotificationReadAt,
  saveNotificationMsgHashMapByLocalStorage,
} from 'global/util/NotificationUtil';
import { QueryStateNotificationMsg } from 'hook/queryhook/QueryStateNotificationMsg';
import React, { useEffect } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import {
  msgConversationScrollInfoAtom,
  sendedMsgListInfoAtom,
} from 'states/MessageAtom';
import { notificationMsgHashMapAtom } from 'states/NotificationAtom';
import webSocketService from '../../services/WebSocketService';
import { sessionActiveUserInfoHashMapAtom } from '../../states/SessionAtom';

const AppInitConfig: React.FC = () => {
  const [sessionActiveUserInfoHashMap, setSessionActiveUserInfoHashMap] =
    useRecoilState(sessionActiveUserInfoHashMapAtom);

  const [notificationMsgHashMap, setNotificationMsgHashMap] = useRecoilState(
    notificationMsgHashMapAtom,
  );

  const { data: lastNotificationList } = QueryStateNotificationMsg(
    getLastNotificationReadAt(),
  );

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

  useEffect(() => {
    if (!webSocketService.isWebSocketInitialized()) {
      webSocketService.initStateManage(
        sessionActiveUserInfoHashMap,
        setSessionActiveUserInfoHashMap,
        notificationMsgHashMap,
        setNotificationMsgHashMap,
        handleUnreadMsg,
      );
      webSocketService.activateConnect();
    }

    return () => {
      if (webSocketService.isWebSocketInitialized()) {
        webSocketService.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!lastNotificationList) return;
    console.log(lastNotificationList);
    saveNotificationMsgHashMapByLocalStorage(lastNotificationList);
  }, [lastNotificationList]);

  return <></>;
};

export default AppInitConfig;
