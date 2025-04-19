import { LOGIN_PATH } from 'const/PathConst';
import {
  CALLBACK_URL,
  IS_WITHDRAW_QUERY_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import {
  AuthTokenRsp,
  BRIDGE_CALENDAR_EVENT_TYPE,
  BRIDGE_EVENT_GEOLOCATION_TYPE,
  BRIDGE_EVENT_IMAGE_NATIVE_UPLOAD_TYPE,
  BRIDGE_EVENT_LOGIN_ROUTE_TYPE,
  BRIDGE_EVENT_POPUP_TYPE,
  BRIDGE_EVENT_REACTION_TYPE,
  BRIDGE_EVENT_ROUTE_TYPE,
  BRIDGE_EVENT_SHARE_TYPE,
  BRIDGE_EVENT_SIGNUP_GRANT_REQUEST_TYPE,
  BRIDGE_EVENT_UPLOAD_VIDEO_TO_SERVER_TYPE,
  BRIDGE_EVENT_VIDEO_GALLERY_NATIVE_UPLOAD_TYPE,
  BRIDGE_EVENT_VIDEO_SHOOT_NATIVE_UPLOAD_TYPE,
  BRIDGE_EXPLORE_MAP_POPUP_EVENT_TYPE,
  BRIDGE_INIT_SETTING_EVENT_TYPE,
  BridgeEventImageNativeRequestInterface,
  BridgeMsgInterface,
  EVENT_DATA_GEOLOCATION_CURRENT_POS_TYPE,
  EVENT_DATA_GOOGLE_LOGIN_TYPE,
  EVENT_DATA_KAKAO_LOGIN_TYPE,
  EVENT_DATA_NAVER_LOGIN_TYPE,
  EVENT_DATA_REACTION_ACTIVE_POPUP_TYPE,
  EVENT_DATA_REACTION_DEACTIVE_POPUP_TYPE,
  EVENT_DATA_REACTION_VIBRATION_HEAVY_TYPE,
  EVENT_DATA_REACTION_VIBRATION_LIGHT_TYPE,
  EVENT_DATA_ROUTE_BACK_TYPE,
  EVENT_DATA_ROUTE_LOGIN_SUCCESS_TYPE,
  EVENT_DATA_ROUTE_LOGIN_TYPE,
  EVENT_DATA_ROUTE_LOGOUT_TYPE,
  EVENT_DATA_ROUTE_NAVIGATE_TYPE,
  EVENT_DATA_ROUTE_POP_TO_TOP_TYPE,
  EVENT_DATA_ROUTE_PREVIOUS_TAB_TYPE,
  EVENT_DATA_ROUTE_PUSH_TYPE,
  EVENT_DATA_ROUTE_REPLACE_TYPE,
  EVENT_DATA_ROUTE_RESET_TYPE,
  EVENT_DATA_ROUTE_WITHDRAW_TYPE,
  EVENT_DATA_SHARE_BASIC_TYPE,
  EVENT_DATA_SHARE_DEEP_LINKING_TYPE,
  EVENT_DATA_SHARE_SMS_TYPE,
  EVENT_DATA_SHARE_SNS_TYPE,
  EVENT_DATA_UPLOAD_VIDEO_TO_SERVER_CREATE_TYPE,
  EVENT_DATA_UPLOAD_VIDEO_TO_SERVER_UPDATE_TYPE,
  EVENT_REACTION_VIBRATION_TYPE,
  EventDateInterface,
  GeoPosGrantRequest,
  RoutePushEventDateInterface,
} from 'const/ReactNativeConst';
import {
  SnsPostComposeCreateReqInterface,
  SnsPostComposeUpdateReqInterface,
} from 'global/interface/post';
import { NavigateFunction } from 'react-router-dom';
import { ShareInfo } from '../ShareUtil';

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
  authToken?: AuthTokenRsp,
  data?: string,
): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_ROUTE_TYPE,
      data: {
        eventType: routeType,
        path: path,
        data: data,
        authToken: authToken,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

// ReactNative Navigation
export const stackRouterNavigation = (url: string, param?: string): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_NAVIGATE_TYPE, url, undefined, param);
  }
};

// 이전 탭으로 이동
export const tabBackNavigation = (navigate: NavigateFunction): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_PREVIOUS_TAB_TYPE);
  } else {
    navigate(-1);
  }
};

// ReactNative Navigation
export const stackRouterReplace = (url: string): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_REPLACE_TYPE, url);
  }
};
interface RouteLoginInterface {
  isNavigate: boolean;
  navigate?: NavigateFunction;
  callbackUrl?: string;
}

export const stackRouterLogin = (routeLogin: RouteLoginInterface): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_LOGIN_TYPE, '');
  } else {
    const pathname =
      LOGIN_PATH +
      (routeLogin.callbackUrl
        ? `?${CALLBACK_URL}=${routeLogin.callbackUrl}`
        : '');
    if (routeLogin.isNavigate) {
      if (!routeLogin.navigate) return;
      routeLogin.navigate(pathname, { replace: true });
    } else {
      window.location.replace(pathname);
    }
  }
};

// ReactNative Navigation
export const stackRouterLogout = (): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_LOGOUT_TYPE, '');
  }
};

export const stackRouterMemberWithdraw = (navigate: NavigateFunction): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_WITHDRAW_TYPE, '');
  } else {
    navigate(`${LOGIN_PATH}?${IS_WITHDRAW_QUERY_PARAM}=${TRUE_PARAM}`);
  }
};

export const stackRouterLoginSuccess = (authToken: AuthTokenRsp): void => {
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
        path: '',
        eventType: isActive
          ? EVENT_DATA_REACTION_ACTIVE_POPUP_TYPE
          : EVENT_DATA_REACTION_DEACTIVE_POPUP_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

// ReactNative Webview에 popup 활성화 전달
export const sendNativeImageUploadEvent = (imageMaxNumber: number): void => {
  if (!window.ReactNativeWebView) return;

  const bridgeEventImageNativeRequestInterface: BridgeEventImageNativeRequestInterface =
    {
      imageMaxNumber: imageMaxNumber,
    };
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_IMAGE_NATIVE_UPLOAD_TYPE,
      data: {
        data: JSON.stringify(bridgeEventImageNativeRequestInterface),
      },
    } as BridgeMsgInterface),
  );
};

export const sendNativeVideoGalleryUploadEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_VIDEO_GALLERY_NATIVE_UPLOAD_TYPE,
    } as BridgeMsgInterface),
  );
};

export const sendNativeVideShootUploadEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_VIDEO_SHOOT_NATIVE_UPLOAD_TYPE,
    } as BridgeMsgInterface),
  );
};

export const sendUploadPostInfoCreateEventToServer = (
  data: SnsPostComposeCreateReqInterface,
): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_UPLOAD_VIDEO_TO_SERVER_TYPE,
      data: {
        eventType: EVENT_DATA_UPLOAD_VIDEO_TO_SERVER_CREATE_TYPE,
        data: JSON.stringify(data),
      },
    } as BridgeMsgInterface),
  );
};

export const sendUploadPostInfoUpdateEventToServer = (
  data: SnsPostComposeUpdateReqInterface,
): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_UPLOAD_VIDEO_TO_SERVER_TYPE,
      data: {
        eventType: EVENT_DATA_UPLOAD_VIDEO_TO_SERVER_UPDATE_TYPE,
        data: JSON.stringify(data),
      },
    } as BridgeMsgInterface),
  );
};

// 공유
export const sendBasicShareEvent = (shareInfo: ShareInfo): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_SHARE_TYPE,
      data: {
        data: JSON.stringify(shareInfo),
        eventType: EVENT_DATA_SHARE_BASIC_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

// 앱 회원가입 시, 권한 요청
export const sendSignupPermissionRequestEvnet = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_SIGNUP_GRANT_REQUEST_TYPE,
    } as BridgeMsgInterface),
  );
};

// 로그인
export const sendGoogleLoginRequestEvnet = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_LOGIN_ROUTE_TYPE,
      data: {
        eventType: EVENT_DATA_GOOGLE_LOGIN_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

export const sendKakaoLoginRequestEvnet = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_LOGIN_ROUTE_TYPE,
      data: {
        eventType: EVENT_DATA_KAKAO_LOGIN_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

export const sendNaverLoginRequestEvnet = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_LOGIN_ROUTE_TYPE,
      data: {
        eventType: EVENT_DATA_NAVER_LOGIN_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

// 위치
export const sendGeolocationCurrentPositionEvnet = (
  isRequest: boolean,
): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_GEOLOCATION_TYPE,
      data: {
        eventType: EVENT_DATA_GEOLOCATION_CURRENT_POS_TYPE,
        data: JSON.stringify({ isRequest: isRequest } as GeoPosGrantRequest),
      },
    } as BridgeMsgInterface),
  );
};

export const sendSmsShareEvent = (smsHref: string): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_SHARE_TYPE,
      data: {
        data: smsHref,
        eventType: EVENT_DATA_SHARE_SMS_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

export const sendDeepLinkShareEvent = (schemeHref: string): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_SHARE_TYPE,
      data: {
        data: schemeHref,
        eventType: EVENT_DATA_SHARE_DEEP_LINKING_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

export const sendSnsShareEvent = (data: BaseShareSingleOptions): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_SHARE_TYPE,
      data: {
        data: JSON.stringify(data),
        eventType: EVENT_DATA_SHARE_SNS_TYPE,
      } as EventDateInterface,
    } as BridgeMsgInterface),
  );
};

export interface BaseShareSingleOptions {
  appId?: string;
  urls?: string[];
  url?: string;
  type?: string;
  filename?: string;
  message?: string;
  title?: string;
  subject?: string;
  email?: string;
  recipient?: string;
  social: Exclude<Social, Social.FacebookStories | Social.InstagramStories>;
  forceDialog?: boolean;
}

export enum Social {
  Facebook = 'facebook',
  FacebookStories = 'facebookstories',
  Pagesmanager = 'pagesmanager',
  Twitter = 'twitter',
  Whatsapp = 'whatsapp',
  Whatsappbusiness = 'whatsappbusiness',
  Instagram = 'instagram',
  InstagramStories = 'instagramstories',
  Googleplus = 'googleplus',
  Email = 'email',
  Pinterest = 'pinterest',
  Linkedin = 'linkedin',
  Sms = 'sms',
  Telegram = 'telegram',
  Snapchat = 'snapchat',
  Messenger = 'messenger',
  Viber = 'viber',
  Discord = 'discord',
}

// ReactNative Webview에 postMessage 요청
export const sendVibrationHeavyEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EVENT_REACTION_TYPE,
      data: {
        path: '',
        eventType: EVENT_REACTION_VIBRATION_TYPE,
        data: EVENT_DATA_REACTION_VIBRATION_HEAVY_TYPE,
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
        path: '',
        eventType: EVENT_REACTION_VIBRATION_TYPE,
        data: EVENT_DATA_REACTION_VIBRATION_LIGHT_TYPE,
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
  data?: RoutePushEventDateInterface,
): void => {
  if (isApp()) {
    sendRouterEvent(
      EVENT_DATA_ROUTE_PUSH_TYPE,
      url,
      undefined,
      data ? JSON.stringify(data) : undefined,
    );
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
export const navigateToMainTab = (
  navigate: NavigateFunction,
  screenName: string,
  url: string,
): void => {
  if (isApp()) {
    sendRouterEvent(EVENT_DATA_ROUTE_POP_TO_TOP_TYPE, screenName);
  } else {
    navigate(url); // React Router의 navigate 사용
  }
};

// 모든 첫 스택 (Details)로 이동
export const navigateToTabWithUrl = (
  navigate: NavigateFunction,
  screenName: string,
  url: string,
  param?: string,
): void => {
  if (isApp()) {
    stackRouterNavigation(screenName, param);
  } else {
    navigate(url); // React Router의 navigate 사용
  }
};

// ReactNative Webview에 popup 활성화 전달
export const sendInitEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_INIT_SETTING_EVENT_TYPE,
    } as BridgeMsgInterface),
  );
};

export const sendOpenCalendarEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_CALENDAR_EVENT_TYPE,
    } as BridgeMsgInterface),
  );
};

export const sendOpenMapExplorePopupEvent = (): void => {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: BRIDGE_EXPLORE_MAP_POPUP_EVENT_TYPE,
    } as BridgeMsgInterface),
  );
};
