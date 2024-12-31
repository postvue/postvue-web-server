export interface AuthTokenRes {
  accessToken: string;
  refreshToken: string;
}

export interface EventDateInterface {
  routeType: string;
  path: string;
  reactionType: string;
  reactionData: string;
  authToken: AuthTokenRes;
}

export interface BridgeMsgInterface {
  type: string;
  data: EventDateInterface;
}
export const BRIDGE_EVENT_POPUP_TYPE = 'POPUP_EVENT';

export const EVENT_DATA_REACTION_ACTIVE_POPUP_TYPE = 'ACTIVE_POPUP';
export const EVENT_DATA_REACTION_DEACTIVE_POPUP_TYPE = 'DEACTIVE_POPUP';

export const BRIDGE_EVENT_ROUTE_TYPE = 'ROUTER_EVENT';

export const EVENT_DATA_ROUTE_BACK_TYPE = 'BACK';
export const EVENT_DATA_ROUTE_PUSH_TYPE = 'PUSH';
export const EVENT_DATA_ROUTE_NAVIGATE_TYPE = 'NAVIGATE';
export const EVENT_DATA_ROUTE_REPLACE_TYPE = 'REPLACE';
export const EVENT_DATA_ROUTE_RESET_TYPE = 'RESET';
export const EVENT_DATA_ROUTE_LOGOUT_TYPE = 'LOGOUT';
export const EVENT_DATA_ROUTE_LOGIN_SUCCESS_TYPE = 'LOGIN_SUCCESS';
export const EVENT_DATA_ROUTE_POP_TO_TOP_TYPE = 'POP_TO_TOP';
export const EVENT_DATA_ROUTE_POP_TO_TOP_TO_PATH_TYPE = 'POP_TO_TOP_TO_PATH';

export const BRIDGE_EVENT_REACTION_TYPE = 'REACTION_EVENT';

export const EVENT_REACTION_VIBRATION_TYPE = 'REACTION_VIBRATION';
export const EVENT_DATA_REACTION_VIBRATION_LIGHT_TYPE = 'LIGHT';
export const EVENT_DATA_REACTION_VIBRATION_HEAVY_TYPE = 'HEAVY';

// screen
export const MAIN_SCREEN = 'MAIN_SCREEN';

export const HOME_PAGE_NAME = 'HOME_PAGE_SCREEN';
export const MAP_PAGE_NAME = 'MAP_PAGE_SCREEN';
export const MESSAGE_PAGE_NAME = 'MESSAGE_PAGE_SCREEN';
export const SCRAP_PAGE_NAME = 'SCRAP_PAGE_SCREEN';
export const ROUTE_WEBVIEW_PAGE_NAME = 'ROUTE_WEBVIEW_PAGE_SCREEN';
