import {
  getLastNotificationReadAt,
  saveNotificationMsgHashMapByLocalStorage,
} from 'global/util/NotificationUtil';
import { QueryStateNotificationMsg } from 'hook/queryhook/QueryStateNotificationMsg';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
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

  useEffect(() => {
    if (!webSocketService.isWebSocketInitialized()) {
      webSocketService.initStateManage(
        sessionActiveUserInfoHashMap,
        setSessionActiveUserInfoHashMap,
        notificationMsgHashMap,
        setNotificationMsgHashMap,
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
