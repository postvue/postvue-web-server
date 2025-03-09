import { MsgConversationWsSub } from 'global/interface/message';
import msgConversationWsService from 'services/websocket/message/MsgConversationWsService';

export const WEBSOCKET_CHANNEL_SESSION_TYPE = 'WEBSOCKET_CHANNEL_SESSION_TYPE';
// export const WEBSOCKET_CHANNEL_NOTIFICATION_TYPE =
//   'WEBSOCKET_CHANNEL_NOTIFICATION_TYPE';
export const WEBSOCKET_CHANNEL_MSG_CONVERSATION_TYPE =
  'WEBSOCKET_CHANNEL_MSG_CONVERSATION_TYPE';

// 타입을 as const로 정확히 추출
export const WEBSOCKET_BROADCAST_MESSAGE_TYPES = {
  WEBSOCKET_CHANNEL_SESSION_TYPE,
  WEBSOCKET_CHANNEL_MSG_CONVERSATION_TYPE,
  // WEBSOCKET_CHANNEL_NOTIFICATION_TYPE,
} as const;

// 타입 추출
type QueryMessageType = keyof typeof WEBSOCKET_BROADCAST_MESSAGE_TYPES;

export interface WebsocketBroadcastMessage {
  type: QueryMessageType;
  data: any;
}

console.log('websocket boad cast channel setting');
const websocketBroadcastChannel = new BroadcastChannel(
  'websocket-broad-cast-channel',
);

websocketBroadcastChannel.onmessage = (ev: MessageEvent) => {
  const message = ev.data as WebsocketBroadcastMessage; // Cast the event data to IMessage

  if (
    message.type ===
    WEBSOCKET_BROADCAST_MESSAGE_TYPES.WEBSOCKET_CHANNEL_MSG_CONVERSATION_TYPE
  ) {
    const messageData = message.data as MsgConversationWsSub;
    msgConversationWsService.processMsg(messageData);
    return;
  }
};

export { websocketBroadcastChannel };
