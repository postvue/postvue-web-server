import {
  BRIDGE_EVENT_WEBSOCKET_CHANNEL_TYPE,
  BridgeMsgInterface,
  EVENT_WEBSOCKET_CHANNEL_NOTIFICATION_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import { SnsNotification } from 'global/db/db';
import { NotificationMsgWsSub } from 'global/interface/notification';
import { convertDate } from 'global/util/DateTimeUtil';

export class NotificationWsServiceByNative {
  private putNotifications:
    | ((messages: Omit<SnsNotification, 'id'>[]) => Promise<void>)
    | null = null;

  handleMsg(
    putNotifications: (
      messages: Omit<SnsNotification, 'id'>[],
    ) => Promise<void>,
  ): (event: MessageEvent) => void {
    this.putNotifications = putNotifications;

    const handleMessage = (event: MessageEvent) => {
      try {
        const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

        if (nativeEvent.type === BRIDGE_EVENT_WEBSOCKET_CHANNEL_TYPE) {
          const eventData: EventDateInterface = nativeEvent.data;
          const data = eventData.data;

          if (
            eventData.eventType === EVENT_WEBSOCKET_CHANNEL_NOTIFICATION_TYPE
          ) {
            const notificationMsgWsSub: NotificationMsgWsSub = JSON.parse(
              data,
            ) as NotificationMsgWsSub;

            // this.saveNotificationWsAndBroadCast(notificationMsgWsSub);
            this.saveNotificationWs(notificationMsgWsSub);
          }
        }
      } catch (error) {
        console.error('Failed to parse message:', event.data);
      }
    };

    return handleMessage;
  }

  public saveNotificationWs = (
    notificationMsgWsSub: NotificationMsgWsSub,
  ): void => {
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
  };
}

const notificationWsServiceByNative = new NotificationWsServiceByNative();
export default notificationWsServiceByNative;
