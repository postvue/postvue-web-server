export interface NotificationMsgWsSub {
  notificationId: string;
  userId: string;
  username: string;
  postId: string;
  notificationUserId: string;
  notificationUsername: string;
  notificationUserProfilePath: string;
  notificationType: string;
  notificationContents: NotificationContent[];
  notifiedAt: string;
  isRead: boolean;
}

export interface NotificationContent {
  snsNotificationContentType: string;
  snsNotificationContent: string;
}
