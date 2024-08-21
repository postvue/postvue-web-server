export interface MsgInboxMessage {
  msgRoomId: string;
  targetUserId: string;
  username: string;
  profilePath: string;
  unreadCount: number;
  sendAt: string;
  msgId: string;
  msgType: string;
  msgContent: string;
}

export interface MsgConversation {
  msgId: string;
  isFollowMsg: boolean;
  msgType: string;
  msgContent: string;
  hasMsgReaction: boolean;
  msgReactionType: string;
  isRead: boolean;
  sendAt: string;
}

export interface MsgConversationWsCreatePub {
  msgType: string;
  msgContent: string;
}

export interface MsgConversationWsUpdatePub {
  msgId: string;
  hasMsg: boolean;
  msgType: string;
  msgContent: string;
  hasMsgReaction: boolean;
  msgReactionType: string;
  isRead: boolean;
}

export interface MsgConversationWsSub {
  msgId: string;
  msgType: string;
  msgContent: string;
  sendAt: string;
  hasMsgReaction: boolean;
  msgReactionType: string;
  isRead: boolean;
  isDeleted: boolean;
  userId: string;
}

export interface MsgBlockHiddenUser {
  targetUserId: string;
  profilePath: string;
  username: string;
}

export interface PutBlockingUserRsp {
  targetUserId: string;
  isBlocked: boolean;
}

export interface PutHiddeningUserRsp {
  targetUserId: string;
  isHidden: boolean;
}

export interface MsgReactionInfo {
  msgId: string;
  msgHeight: number;
  y: number;
  height: number;
  isMyMsg: boolean;
  msgText: string;
}
