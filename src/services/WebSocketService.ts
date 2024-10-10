import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { SetterOrUpdater } from 'recoil';

import { ACCESS_TOKEN_EXPIRED_ERROR_STOMP_DELIVERY_MESSAGE } from 'const/WebSocketStompErrorConst';
import { NotificationMsgWsSub } from 'global/interface/notification';
import { ProfileMyInfo } from 'global/interface/profile';
import { getAccessTokenByBearer } from 'global/util/AuthUtil';
import { getAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { handleWebSocketStomp } from 'services';
import { SessionActiveUserInfoSub } from '../global/interface/session';
import { getMyAccountSettingInfo } from '../global/util/MyAccountSettingUtil';
import notificationWsService from './notification/NotificationWsService';
import sessionWsService from './session/SessionWsService';
import {
  WEBSOCKET_APPLICATION_PATH,
  WEBSOCKET_ENDPOINT_URL,
} from './websocketServicePath';

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
      debug: (str) => {
        console.log(str); //@REFER: 나중에 지우도록
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // webSocketFactory: () => new SockJS(this.getSocketUrl()),
      onDisconnect: this.onDisconnect,
      onStompError: this.onStompError,
      onWebSocketError: (frame) => {
        console.log('에러', frame);
      },
    });
    console.log('WebSocketService 인스턴스가 생성되었습니다.', this.client);
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
  ): void {
    this.sessionActiveUserInfoHashMap = sessionActiveUserInfoHashMap;
    this.setSessionActiveUserInfoHashMap = setSessionActiveUserInfoHashMap;
    this.notificationMsgHashMap = notificationMsgHashMap;
    this.setNotificationMsgHashMap = setNotificationMsgHashMap;
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
      console.log('초기화');
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
    }
  };

  private onDisconnect = (frame: any) => {
    console.log('Disconnected: ', frame);
  };

  private onStompError = async (frame: any) => {
    console.error('STOMP Error: ', frame);
    console.log('Broker reported error: ' + frame.headers['message']);
    const errorCode = frame.headers['errorCode'];
    console.log(errorCode);
    console.error('Additional details: ' + frame.body);
    console.error('Additional details: ' + frame._body);

    if (ACCESS_TOKEN_EXPIRED_ERROR_STOMP_DELIVERY_MESSAGE === frame.body) {
      console.log('실행?');
      await handleWebSocketStomp(() => {
        if (
          !this.sessionActiveUserInfoHashMap ||
          !this.setSessionActiveUserInfoHashMap
        )
          return;
        console.log(
          '실행 2',
          getAccessTokenByBearer(getAccessTokenToLocalStorage()),
        );
        this.disconnect();
        this.activateConnect();
      });
    }
  };

  protected getSocketUrl(): string {
    return `${WEBSOCKET_APPLICATION_PATH}`;
  }

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
