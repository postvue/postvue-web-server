import {
  NOTIFICATION_LAST_READ_DATE_TIME,
  NOTIFICATION_MSG_LIST,
} from 'const/LocalStorageConst';
import { NOTIFICATION_MSG_MAX_RETATION_DAY } from 'const/NotificationConst';
import { NotificationMsgWsSub } from 'global/interface/notification';
import {
  getDateFormatToServerDateTimeString,
  getDateNDaysAgo,
} from './DateTimeUtil';

export const getNotificationMsgHashMapByLocalStorage = (): Map<
  string,
  NotificationMsgWsSub
> => {
  const notificationMsgHashMap: Map<string, NotificationMsgWsSub> = JSON.parse(
    localStorage.getItem(NOTIFICATION_MSG_LIST) || JSON.stringify([]),
  );
  return new Map(notificationMsgHashMap);
};

export const resetNotificationMsgListByLocalStorage = (): void => {
  localStorage.removeItem(NOTIFICATION_MSG_LIST);
};

export const saveNotificationMsgHashMapByLocalStorage = (
  newNotificationMsgList: NotificationMsgWsSub[],
): void => {
  const notificationMsgHashMap = new Map(
    getNotificationMsgHashMapByLocalStorage(),
  );

  newNotificationMsgList = newNotificationMsgList.filter(
    (value) => value !== undefined && value !== null,
  );

  if (newNotificationMsgList.length > 0) {
    newNotificationMsgList.forEach((notification) => {
      notificationMsgHashMap.set(notification.notificationId, notification);
    });

    localStorage.setItem(
      NOTIFICATION_MSG_LIST,
      JSON.stringify(
        new Map(
          Array.from(notificationMsgHashMap.entries()).sort((a, b) =>
            b[0].localeCompare(a[0]),
          ),
        ),
      ),
    );

    setLastNotificationReadAt(newNotificationMsgList[0].notifiedAt);
  }
};

export const readNotificationMsgByLocalStorage = (): void => {
  const notificationMsgHashMap = getNotificationMsgHashMapByLocalStorage();

  notificationMsgHashMap.forEach((value) => {
    value.isRead = true;
  });
  localStorage.setItem(
    NOTIFICATION_MSG_LIST,
    JSON.stringify(notificationMsgHashMap),
  );
};

export const getLastNotificationReadAt = (): string => {
  return (
    localStorage.getItem(NOTIFICATION_LAST_READ_DATE_TIME) ||
    getDateFormatToServerDateTimeString(
      getDateNDaysAgo(NOTIFICATION_MSG_MAX_RETATION_DAY),
    )
  );
};

export const setLastNotificationReadAt = (serverDateString: string): string => {
  localStorage.setItem(NOTIFICATION_LAST_READ_DATE_TIME, serverDateString);
  return serverDateString;
};
