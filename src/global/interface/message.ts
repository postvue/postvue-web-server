import { MsgConversationSubEventType } from 'services/websocket/message/MsgConversationSubEventType';

export interface MsgInboxMessage {
  msgRoomId: string;
  targetUserId: string;
  username: string;
  nickname: string;
  profilePath: string;
  unreadCount: number;
  sendAt: string;
  msgId: string;

  hasMsgMedia: boolean;
  msgTextContent: string;
  msgMediaType: string;
  msgMediaContent: string;
}

export interface MsgLinkMetaInfo {
  ogTitle: string;
  ogImage: string;
  ogDescritpion: string;
}

export interface MsgDirectConversationRsp {
  msgRoomId: string;
  msgId: string;
  msgTextContent: string;
  hasMsgMedia: boolean;
  msgMediaType: string;
  msgMediaContent: string;
  sendAt: string;
  hasMsgReaction: boolean;
  msgReactionType: string;
  sourceUserId: string;
  isOtherMsg: boolean;
  msgLinkMetaInfo: MsgLinkMetaInfo;
}

export interface MsgConversation {
  msgRoomId: string;
  isGroupedMsg: boolean;

  msgId: string;
  targetUserId: string;
  isOtherMsg: boolean;

  msgTextContent: string;
  hasMsgMedia: boolean;
  msgMediaType: string;
  msgMediaContent: string;
  msgLinkMetaInfo: MsgLinkMetaInfo;

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

  // 전달 메시지 유형: 생성, 삭제, 수정, 오류
  eventType: MsgConversationSubEventType;

  sourceUserId: string;
  targetUserId: string;
  msgId: string;

  msgTextContent: string;
  hasMsgMedia: boolean;
  msgMediaType: string;
  msgMediaContent: string;
  msgLinkMetaInfo: MsgLinkMetaInfo;
  hasMsgReaction: boolean;
  msgReactionType: string;
  errorMsg: string;

  sendAt: string;
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

export interface DirectMsgReq {
  msgTextContent: string;
}
