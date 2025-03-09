import { IMessage } from '@stomp/stompjs';

import { SnsNotification } from 'global/db/db';
import { NotificationMsgWsSub } from 'global/interface/notification';
import { convertDate } from 'global/util/DateTimeUtil';
import webSocketService from '../WebSocketService';
import { NOTIFICATIONS_BROKER_PATH } from '../websocketServicePath';

export class NotificationWsService {
  private desination: string | null = null;
  private putNotifications:
    | ((messages: Omit<SnsNotification, 'id'>[]) => Promise<void>)
    | null = null;
  // private notificationMsgHashMap: Map<string, NotificationMsgWsSub> | null =
  //   null;
  // private setNotificationMsgHashMap: SetterOrUpdater<
  //   Map<string, NotificationMsgWsSub>
  // > | null = null;

  connect(
    channelUserId: string,
    putNotifications: (
      messages: Omit<SnsNotification, 'id'>[],
    ) => Promise<void>,
    // notificationMsgHashMap: Map<string, NotificationMsgWsSub>,
    // setNotificationMsgHashMap: SetterOrUpdater<
    //   Map<string, NotificationMsgWsSub>
    // >,
  ): void {
    this.putNotifications = putNotifications;
    // this.notificationMsgHashMap = notificationMsgHashMap;
    // this.setNotificationMsgHashMap = setNotificationMsgHashMap;

    if (webSocketService !== null) {
      webSocketService.addOnInitializedCallback(() => {
        if (!webSocketService) return;

        this.desination = `${NOTIFICATIONS_BROKER_PATH}/${channelUserId}`;
        webSocketService.setSubscribe(this.desination, (message: IMessage) => {
          const notificationMsgWsSub: NotificationMsgWsSub = JSON.parse(
            message.body,
          ) as NotificationMsgWsSub;

          // this.saveNotificationWsAndBroadCast(notificationMsgWsSub);

          this.saveNotificationWs(notificationMsgWsSub);
        });
      });
    }
  }

  disconnect(): void {
    if (webSocketService === null || this.desination === null) return;

    if (webSocketService.isWebSocketInitialized()) {
      webSocketService.deleteSubscribe(this.desination);
    }
  }

  // private saveNotificationWsAndBroadCast = (
  //   notificationMsgWsSub: NotificationMsgWsSub,
  // ) => {
  //   this.saveNotificationWs(notificationMsgWsSub);
  //   // websocketBroadcastChannel.postMessage({
  //   //   type: WEBSOCKET_BROADCAST_MESSAGE_TYPES.WEBSOCKET_CHANNEL_NOTIFICATION_TYPE,
  //   //   data: notificationMsgWsSub,
  //   // } as WebsocketBroadcastMessage);
  // };

  public saveNotificationWs = (
    notificationMsgWsSub: NotificationMsgWsSub,
  ): void => {
    // if (
    //   this.notificationMsgHashMap === null ||
    //   this.setNotificationMsgHashMap === null
    // )
    //   return;

    // const tempNotificationMsgHashMap = new Map(this.notificationMsgHashMap);

    // tempNotificationMsgHashMap.set(
    //   notificationMsgWsSub.notificationId,
    //   notificationMsgWsSub,
    // );

    const notificationMsg: SnsNotification = {
      id: notificationMsgWsSub.notificationId,
      isRead: notificationMsgWsSub.isRead,
      notificationContents: notificationMsgWsSub.notificationContents,
      notificationId: notificationMsgWsSub.notificationId,
      notificationType: notificationMsgWsSub.notificationType,
      notificationUserId: notificationMsgWsSub.notificationUserId,
      notificationUserProfilePath:
        notificationMsgWsSub.notificationUserProfilePath,
      notificationUsername: notificationMsgWsSub.notificationUsername,
      notifiedAt: convertDate(notificationMsgWsSub.notifiedAt),
      postId: notificationMsgWsSub.postId,
      userId: notificationMsgWsSub.userId,
      username: notificationMsgWsSub.username,
    };

    if (!this.putNotifications) return;
    this.putNotifications([notificationMsg]);

    // this.setNotificationMsgHashMap(tempNotificationMsgHashMap);
    // saveNotificationMsgHashMapByLocalStorage([notificationMsgWsSub]);
  };
}

const notificationWsService = new NotificationWsService();
export default notificationWsService;
