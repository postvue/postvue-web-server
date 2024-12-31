import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { SetterOrUpdater } from 'recoil';

import {
  WEBSOCKET_HEARTBEAT_INCOMING_TIME,
  WEBSOCKET_HEARTBEAT_OUTGOING_TIME,
  WEBSOCKET_RECONNECT_DELAY_TIME,
} from 'const/WebSocketConfigConst';
import { ACCESS_TOKEN_EXPIRED_ERROR_STOMP_DELIVERY_MESSAGE } from 'const/WebSocketStompErrorConst';
import { NotificationMsgWsSub } from 'global/interface/notification';
import { ProfileMyInfo } from 'global/interface/profile';
import { getAccessTokenByBearer } from 'global/util/AuthUtil';
import { getAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { handleWebSocketStomp } from 'services';
import { SessionActiveUserInfoSub } from '../global/interface/session';
import { getMyAccountSettingInfo } from '../global/util/MyAccountSettingUtil';
import msgConversationWsService from './message/MsgConversationWsService';
import notificationWsService from './notification/NotificationWsService';
import sessionWsService from './session/SessionWsService';
import { WEBSOCKET_ENDPOINT_URL } from './websocketServicePath';

class WebSocketService {
  private static instance: WebSocketService;
  protected client: Client;
  private sessionActiveUserInfoHashMap: Map<string, SessionActiveUserInfoSub> =
    new Map();
  private setSessionActiveUserInfoHashMap: SetterOrUpdater<
    Map<string, SessionActiveUserInfoSub>
  > | null = null;
  private notificationMsgHashMap: Map<string, NotificationMsgWsSub> = new Map();
  private setNotificationMsgHashMap: SetterOrUpdater<
    Map<string, NotificationMsgWsSub>
  > | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private handleUnreadMsg: () => void = () => {};
  private authorization = '';
  private isInitialized = false;
  private onInitializedCallbacks: Array<() => void> = [];
  private subscribedChannels: Map<string, StompSubscription> = new Map(); // 구독된 채널을 관리하는 Map

  constructor() {
    this.client = new Client({
      brokerURL: WEBSOCKET_ENDPOINT_URL,
      connectHeaders: {
        Authorization: this.authorization,
      },
      // debug: (str) => {
      //   console.log(str); //@REFER: 나중에 지우도록
      // },
      reconnectDelay: WEBSOCKET_RECONNECT_DELAY_TIME,
      heartbeatIncoming: WEBSOCKET_HEARTBEAT_INCOMING_TIME,
      heartbeatOutgoing: WEBSOCKET_HEARTBEAT_OUTGOING_TIME,
      // webSocketFactory: () => new SockJS(this.getSocketUrl()),
      onStompError: this.onStompError,
    });
  }
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initStateManage(
    sessionActiveUserInfoHashMap: Map<string, SessionActiveUserInfoSub>,
    setSessionActiveUserInfoHashMap: SetterOrUpdater<
      Map<string, SessionActiveUserInfoSub>
    >,
    notificationMsgHashMap: Map<string, NotificationMsgWsSub>,
    setNotificationMsgHashMap: SetterOrUpdater<
      Map<string, NotificationMsgWsSub>
    >,
    handleUnreadMsg: () => void,
  ): void {
    this.sessionActiveUserInfoHashMap = sessionActiveUserInfoHashMap;
    this.setSessionActiveUserInfoHashMap = setSessionActiveUserInfoHashMap;
    this.notificationMsgHashMap = notificationMsgHashMap;
    this.setNotificationMsgHashMap = setNotificationMsgHashMap;
    this.handleUnreadMsg = handleUnreadMsg;
  }

  public activateConnect(): void {
    // 이미 WebSocket이 활성화되어 있으면 중단

    if (this.client.active || this.isInitialized) {
      console.log('WebSocket already active or initialized.');
      return;
    }
    this.authorization = getAccessTokenByBearer(getAccessTokenToLocalStorage());
    this.client.connectHeaders = {
      Authorization: this.authorization,
    };

    this.client.activate();

    this.client.onConnect = () => {
      this.isInitialized = true;
      this.onInitializedCallbacks.forEach((callback) => callback());
      this.onInitializedCallbacks = [];
      this.onConnectSession();
    };
  }

  public isWebSocketInitialized(): boolean {
    return this.isInitialized;
  }

  public addOnInitializedCallback(callback: () => void): void {
    if (this.isInitialized) {
      callback(); // 이미 초기화된 경우 즉시 실행
    } else {
      this.onInitializedCallbacks.push(callback); // 아니면 리스트에 추가
    }
  }

  disconnect(): void {
    this.client.deactivate();
    this.isInitialized = false;
  }

  private onConnectSession = () => {
    const myAccountSetting: ProfileMyInfo = getMyAccountSettingInfo();
    if (
      myAccountSetting !== null &&
      this.setSessionActiveUserInfoHashMap !== null &&
      this.setNotificationMsgHashMap !== null
    ) {
      sessionWsService.connect(
        myAccountSetting,
        this.sessionActiveUserInfoHashMap,
        this.setSessionActiveUserInfoHashMap,
      );
      notificationWsService.connect(
        myAccountSetting,
        this.notificationMsgHashMap,
        this.setNotificationMsgHashMap,
      );
      msgConversationWsService.connect(this.handleUnreadMsg, myAccountSetting);
    }
  };

  private onStompError = async (frame: any) => {
    if (ACCESS_TOKEN_EXPIRED_ERROR_STOMP_DELIVERY_MESSAGE === frame.body) {
      await handleWebSocketStomp(() => {
        if (
          !this.sessionActiveUserInfoHashMap ||
          !this.setSessionActiveUserInfoHashMap
        )
          return;

        this.disconnect();
        this.activateConnect();
      }).catch(() => {
        console.log('어라라라');
      });
    }
  };

  public setSubscribe(
    destination: string,
    callback: (message: IMessage) => void,
    setSessionId?: React.Dispatch<React.SetStateAction<string>>,
  ): void {
    if (this.subscribedChannels.has(destination)) {
      console.log(`Already subscribed to ${destination}`);

      return;
    }

    const stompSubscription: StompSubscription = this.client.subscribe(
      destination,
      callback,
    );
    if (setSessionId !== undefined) {
      setSessionId(stompSubscription.id);
    }

    // 구독 성공 시 구독된 채널 관리
    this.subscribedChannels.set(destination, stompSubscription);
  }

  public deleteSubscribe(sessionId: string): void {
    this.client.unsubscribe(sessionId);
  }

  public publishMessage(destination: string, messageString: string): void {
    this.client.publish({
      destination,
      body: messageString,
      headers: {
        Authorization: getAccessTokenByBearer(getAccessTokenToLocalStorage()),
      },
    });
  }
}
const webSocketService = WebSocketService.getInstance();
export default webSocketService;
