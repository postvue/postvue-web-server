import { SnsNotification } from 'global/db/db';
import { convertDate } from 'global/util/DateTimeUtil';
import { convertNotificationAt } from 'global/util/NotificationUtil';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import { QueryStateNotificationMsg } from 'hook/queryhook/QueryStateNotificationMsg';
import React, { useEffect } from 'react';

const NotificationChannelConfig: React.FC = () => {
  const {
    notifications: notificationMsgList,
    putNotifications,
    latestNotificationAt,
  } = useSnsNotificationHookByIndexedDb();

  const { data: lastNotificationList } = QueryStateNotificationMsg(
    convertNotificationAt(latestNotificationAt) || '',
  );

  // const notificationHashMapString = useLocalStorageListener(
  //   NOTIFICATION_MSG_LIST,
  // );

  useEffect(() => {
    if (!lastNotificationList) return;
    // saveNotificationMsgHashMapByLocalStorage(lastNotificationList);
    const dataList: SnsNotification[] = lastNotificationList.map((v) => {
      return {
        id: v.notificationId,
        isRead: v.isRead,
        notificationContents: v.notificationContents,
        notificationId: v.notificationId,
        notificationType: v.notificationType,
        notificationUserId: v.notificationUserId,
        notificationUserProfilePath: v.notificationUserProfilePath,
        notificationUsername: v.notificationUsername,
        notifiedAt: convertDate(v.notifiedAt),
        postId: v.postId,
        userId: v.userId,
        username: v.username,
      };
    });
    putNotifications(dataList);
  }, [lastNotificationList]);

  return <></>;
};

export default NotificationChannelConfig;
