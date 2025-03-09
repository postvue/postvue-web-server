export type MsgConversationSubEventType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ERROR'
  | 'REACTION';

export const MSG_CONVERSATION_SUB_CREATE_EVENT_TYPE: MsgConversationSubEventType =
  'CREATE';

export const MSG_CONVERSATION_SUB_UPDATE_EVENT_TYPE: MsgConversationSubEventType =
  'UPDATE';

export const MSG_CONVERSATION_SUB_DELETE_EVENT_TYPE: MsgConversationSubEventType =
  'DELETE';

export const MSG_CONVERSATION_SUB_ERROR_EVENT_TYPE: MsgConversationSubEventType =
  'ERROR';

export const MSG_CONVERSATION_SUB_REACTION_EVENT_TYPE: MsgConversationSubEventType =
  'REACTION';
