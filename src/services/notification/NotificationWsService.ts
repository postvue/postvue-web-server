import { IMessage } from '@stomp/stompjs';

import { NotificationMsgWsSub } from 'global/interface/notification';
import { ProfileMyInfo } from 'global/interface/profile';
import { saveNotificationMsgHashMapByLocalStorage } from 'global/util/NotificationUtil';
import { SetterOrUpdater } from 'recoil';
import webSocketService from '../WebSocketService';
import { NOTIFICATIONS_BROKER_PATH } from '../websocketServicePath';

export class NotificationWsService {
  connect(
    myAccountSeetingInterface: ProfileMyInfo,
    notificationMsgHashMap: Map<string, NotificationMsgWsSub>,
    setNotificationMsgHashMap: SetterOrUpdater<
      Map<string, NotificationMsgWsSub>
    >,
  ): void {
    webSocketService.addOnInitializedCallback(() => {
      webSocketService.setSubscribe(
        `${NOTIFICATIONS_BROKER_PATH}/${myAccountSeetingInterface.userId}`,
        (message: IMessage) => {
          const notificationMsgWsSub: NotificationMsgWsSub = JSON.parse(
            message.body,
          ) as NotificationMsgWsSub;

          const tempNotificationMsgHashMap = new Map(notificationMsgHashMap);

          tempNotificationMsgHashMap.set(
            notificationMsgWsSub.notificationId,
            notificationMsgWsSub,
          );

          setNotificationMsgHashMap(tempNotificationMsgHashMap);
          saveNotificationMsgHashMapByLocalStorage([notificationMsgWsSub]);
        },
      );
    });
  }

  disconnect(sessionId: string): void {
    if (webSocketService.isWebSocketInitialized()) {
      webSocketService.deleteSubscribe(sessionId);
    }
  }
}

const notificationWsService = new NotificationWsService();
export default notificationWsService;
