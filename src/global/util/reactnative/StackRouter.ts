import {
  AuthTokenRes,
  BRIDGE_EVENT_POPUP_TYPE,
  BRIDGE_EVENT_REACTION_TYPE,
  BRIDGE_EVENT_ROUTE_TYPE,
  BridgeMsgInterface,
  EVENT_DATA_REACTION_ACTIVE_POPUP_TYPE,
  EVENT_DATA_REACTION_DEACTIVE_POPUP_TYPE,
  EVENT_DATA_REACTION_VIBRATION_HEAVY_TYPE,
  EVENT_DATA_REACTION_VIBRATION_LIGHT_TYPE,
  EVENT_DATA_ROUTE_BACK_TYPE,
  EVENT_DATA_ROUTE_LOGIN_SUCCESS_TYPE,
  EVENT_DATA_ROUTE_LOGOUT_TYPE,
  EVENT_DATA_ROUTE_NAVIGATE_TYPE,
  EVENT_DATA_ROUTE_POP_TO_TOP_TYPE,
  EVENT_DATA_ROUTE_PUSH_TYPE,
  EVENT_DATA_ROUTE_REPLACE_TYPE,
  EVENT_DATA_ROUTE_RESET_TYPE,
  EVENT_REACTION_VIBRATION_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import { NavigateFunction } from 'react-router-dom';

export const isApp = (): boolean => {
  let isApp = false;

  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    isApp = true;
  }

  return isApp;
};

// ReactNative Webview에 postMessage 요청
const sendRouterEvent = (
  routeType: string,
  path?: string,
  authToken?: AuthTokenRes,
): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_ROUTE_TYPE,
      data: {
        routeType: routeType,
        path: path,
        authToken: authToken,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

// ReactNative Navigation
export const stackRouterNavigation = (url: string): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_NAVIGATE_TYPE, url);
  }
};

// ReactNative Navigation
export const stackRouterReplace = (url: string): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_REPLACE_TYPE, url);
  }
};

// ReactNative Navigation
export const stackRouterLogout = (): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_LOGOUT_TYPE, '');
  }
};

export const stackRouterLogin = (authToken: AuthTokenRes): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_LOGIN_SUCCESS_TYPE, '', authToken);
  }
};

// ReactNative Webview에 popup 활성화 전달
export const sendPopupEvent = (isActive: boolean): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_POPUP_TYPE,
      data: {
        routeType: '',
        path: '',
        reactionType: isActive
          ? EVENT_DATA_REACTION_ACTIVE_POPUP_TYPE
          : EVENT_DATA_REACTION_DEACTIVE_POPUP_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

// ReactNative Webview에 postMessage 요청
export const sendVibrationHeavyEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_REACTION_TYPE,
      data: {
        routeType: '',
        path: '',
        reactionType: EVENT_REACTION_VIBRATION_TYPE,
        reactionData: EVENT_DATA_REACTION_VIBRATION_HEAVY_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

export const sendVibrationLightEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_REACTION_TYPE,
      data: {
        routeType: '',
        path: '',
        reactionType: EVENT_REACTION_VIBRATION_TYPE,
        reactionData: EVENT_DATA_REACTION_VIBRATION_LIGHT_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

// 뒤로가기 하는 경우
export const stackRouterBack = (navigate: NavigateFunction): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_BACK_TYPE);
  } else {
    navigate(-1);
  }
};

// push 하는 경우
export const stackRouterPush = (
  navigate: NavigateFunction,
  url: string,
): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_PUSH_TYPE, url);
  } else {
    navigate(url);
  }
};

// 첫 번째 스택만 남기고 나머지 스택을 제거한 후, 첫 번째 스택으로 이동하며 URL 변경
export const stackRouterResetAndPush = (
  navigate: NavigateFunction,
  url: string,
): void => {
  if (isApp()) {
    // WebView에서 첫 번째 스택만 남기고 나머지 스택을 제거하도록 명령
    sendRouterEvent(EVENT_DATA_ROUTE_RESET_TYPE); // 'reset' 이벤트를 WebView에 전달 (다음에 이를 처리하는 로직을 WebView에서 구현)
  } else {
    // React Router에서 스택을 리셋하고 URL로 이동
    navigate(url, { replace: true }); // `replace: true`로 첫 번째 화면만 남기고 다른 스택을 제거
  }
};

// 모든 첫 스택 (Details)로 이동
export const navigateToFirstStack = (navigate: NavigateFunction): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_POP_TO_TOP_TYPE);
  } else {
    navigate(EVENT_DATA_ROUTE_POP_TO_TOP_TYPE); // React Router의 navigate 사용
  }
};

// 모든 첫 스택 (Details)로 이동
export const navigateToFirstStackWithUrl = (
  navigate: NavigateFunction,
  screenName: string,
  url: string,
): void => {
  if (isApp()) {
    stackRouterNavigation(screenName);
  } else {
    navigate(url); // React Router의 navigate 사용
  }
};
