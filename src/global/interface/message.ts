export interface MsgInboxMessage {
  targetUserId: string;
  username: string;
  profilePath: string;
  unreadCount: number;
  sendAt: string;
  msgId: string;
  msgType: string;
  msgContent: string;
}

export interface MsgDirectConversationRsp {
  msgRoomId: string;
  msgId: string;
  msgType: string;
  msgContent: string;
  sendAt: string;
  hasMsgReaction: boolean;
  msgReactionType: string;
  sourceUserId: string;
  isOtherMsg: boolean;
}

export interface MsgConversation {
  msgId: string;
  msgRoomId: string;
  isGroupedMsg: boolean;
  targetUserId: string;
  isOtherMsg: boolean;
  msgType: string;
  msgContent: string;
  hasMsgReaction: boolean;
  msgReactionType: string;
  sendAt: string;
}

export interface MsgDeletedConversation {
  msgId: string;
  msgRoomId: string;
  isGroupedMsg: boolean;
  targetUserId: string;
  sourceUserId: string;
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
}

export interface MsgConversationWsSub {
  msgRoomId: string;
  isGroupedMsg: boolean;
  targetUserId: string;
  msgId: string;
  msgType: string;
  msgContent: string;
  sendAt: string;
  hasMsgReaction: boolean;
  msgReactionType: string;
  sourceUserId: string;
  isDeleted: boolean;
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
