// db.ts
import Dexie, { type EntityTable } from 'dexie';
import { MsgDirectConversationRsp } from 'global/interface/message';

export interface SnsDirectMsg {
  id: number;
  msgId: string;
  msgRoomId: string;
  msgData: MsgDirectConversationRsp;
  sendAt: string;
}

export interface SnsNotificationContent {
  snsNotificationContent: string;
  snsNotificationContentType: string;
}

export interface SnsNotification {
  id: string;
  notificationId: string;
  isRead: boolean;
  notificationContents: SnsNotificationContent[];
  notificationType: string;
  notificationUserId: string;
  notificationUserProfilePath: string;
  notificationUsername: string;
  notifiedAt: Date;
  postId: string;
  userId: string;
  username: string;
}

export interface ActiveUserSession {
  id: string;
  userId: string;
  sessionState: boolean;
  lastActivityDateTime: Date;
}

// private personal user db
const db = new Dexie('feelog-pu-db') as Dexie & {
  snsDirectMsgs: EntityTable<
    SnsDirectMsg,
    'id' // primary key "id" (for the typings only)
  >;
  snsNotification: EntityTable<SnsNotification, 'id'>;
  activeUserSession: EntityTable<ActiveUserSession, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  snsDirectMsgs: '++id, msgId, msgRoomId, sendAt', // primary key "id" (for the runtime!)
  snsNotification: 'id, notificationId, userId, notifiedAt',
  activeUserSession: 'id, userId, sessionState, lastActivityDateTime',
});

export { db };
