import { convertDateToCurrentCountryISO } from './DateTimeUtil';

// export const convertNotificationMspHash = (
//   jsonString: string,
// ): Map<string, NotificationMsgWsSub> => {
//   try {
//     const parsed = JSON.parse(jsonString);

//     // parsed가 객체라면 배열로 변환
//     const entries = Array.isArray(parsed) ? parsed : Object.entries(parsed);

//     return new Map(entries);
//   } catch (error) {
//     console.error('Failed to convert JSON string to Map:', error);
//     throw new Error('Invalid JSON string or structure.');
//   }
// };

// export const getNotificationMsgHashMapByLocalStorage = (): Map<
//   string,
//   NotificationMsgWsSub
// > => {
//   return convertNotificationMspHash(
//     localStorage.getItem(NOTIFICATION_MSG_LIST) || JSON.stringify([]),
//   );
// };

// export const resetNotificationMsgListByLocalStorage = (): void => {
//   localStorage.removeItem(NOTIFICATION_MSG_LIST);
// };

// export const saveNotificationMsgHashMapByLocalStorage = (
//   newNotificationMsgList: NotificationMsgWsSub[],
// ): void => {
//   const notificationMsgHashMap = new Map(
//     getNotificationMsgHashMapByLocalStorage(),
//   );

//   newNotificationMsgList = newNotificationMsgList.filter(
//     (value) => value !== undefined && value !== null,
//   );

//   if (newNotificationMsgList.length > 0) {
//     newNotificationMsgList.forEach((notification) => {
//       notificationMsgHashMap.set(notification.notificationId, notification);
//     });

//     localStorage.setItem(
//       NOTIFICATION_MSG_LIST,
//       JSON.stringify(
//         new Map(
//           Array.from(notificationMsgHashMap.entries()).sort((a, b) =>
//             b[0].localeCompare(a[0]),
//           ),
//         ),
//       ),
//     );

//     // setLastNotificationReadAt(newNotificationMsgList[0].notifiedAt);
//   }
// };

// export const readNotificationMsgByLocalStorage = (): void => {
//   const notificationMsgHashMap = getNotificationMsgHashMapByLocalStorage();

//   notificationMsgHashMap.forEach((value) => {
//     value.isRead = true;
//   });
//   localStorage.setItem(
//     NOTIFICATION_MSG_LIST,
//     JSON.stringify(notificationMsgHashMap),
//   );
// };

export const convertNotificationAt = (
  notificationAt: Date | null,
): string | null => {
  if (notificationAt) {
    return convertDateToCurrentCountryISO(notificationAt);
  } else {
    return null;
  }
};

// export const getLastNotificationReadAt = (): string => {
//   const notificationMsgHashMap = getNotificationMsgHashMapByLocalStorage();
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // 현재 날짜에서 한 달 전으로 설정

//   // 한 달 전 날짜를 ISO 8601 형식의 문자열로 변환
//   const oneMonthAgoString = oneMonthAgo.toISOString();
//   const latestElement = Array.from(notificationMsgHashMap.entries()).reduce(
//     (latest, current) => {
//       return new Date(current[1].notifiedAt) > new Date(latest[1].notifiedAt)
//         ? current
//         : latest;
//     },
//     [
//       '' as string,
//       {
//         notificationId: '',
//         userId: '',
//         username: '',
//         postId: '',
//         notificationUserId: '',
//         notificationUsername: '',
//         notificationUserProfilePath: '',
//         notificationType: '',
//         notificationContents: [],
//         notifiedAt: oneMonthAgoString,
//         isRead: false,
//       } as NotificationMsgWsSub,
//     ],
//   );

//   return latestElement[1].notifiedAt;
// };

// export const setLastNotificationReadAt = (serverDateString: string): string => {
//   localStorage.setItem(NOTIFICATION_LAST_READ_DATE_TIME, serverDateString);
//   return serverDateString;
// };
