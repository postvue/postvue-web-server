import { WEBSOCKET_URL } from 'const/SystemAttrConst';

export const WEBSOCKET_APPLICATION_PATH = '/ws';
export const BROKER_PATH = '/topic';
export const APPLICATION_PATH = '/app';

// 나중에 wss로 변경 필요
export const WEBSOCKET_ENDPOINT_URL = `${WEBSOCKET_URL}${WEBSOCKET_APPLICATION_PATH}`;
// `ws://localhost:8080${WEBSOCKET_APPLICATION_PATH}`;

export const APP_MESSAGE_CONVERSATIONS_PATH = '/conversations';
export const APP_NOTIFICATIONS_PATH = '/notifications';

// export const SESSION_INIT
const SESSION_PATH = '/sessions';
export const SESSION_BROKER_PATH = `${BROKER_PATH}${SESSION_PATH}`;

export const API_SESSIONS_PATH = `${APPLICATION_PATH}${SESSION_PATH}`;

export const SESSION_BROKER_VERIFICATION_PATH = `${BROKER_PATH}${SESSION_PATH}/verification`;

export const MESSAGES_BROKER_PATH = `${BROKER_PATH}${APP_MESSAGE_CONVERSATIONS_PATH}`;

export const API_MESSAGES_PATH = `${APPLICATION_PATH}${APP_MESSAGE_CONVERSATIONS_PATH}`;

export const NOTIFICATIONS_BROKER_PATH = `${BROKER_PATH}${APP_NOTIFICATIONS_PATH}`;
