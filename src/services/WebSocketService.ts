import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { SetterOrUpdater } from 'recoil';
import SockJS from 'sockjs-client';

import { ProfileMyInfo } from 'global/interface/profile';
import {
  SessionActiveUserInfoSub,
  SessionActiveUserListSub,
} from '../global/interface/session';
import { getMyAccountSettingInfo } from '../global/util/MyAccountSettingUtil';
import {
  API_SESSIONS_PATH,
  SESSION_BROKER_PATH,
  WEBSOCKET_APPLICATION_PATH,
} from './websocketServicePath';

export class WebSocketService {
  protected client: Client;
  private sessionActiveUserInfoHashMap: Map<
    string,
    SessionActiveUserInfoSub
  > | null = null;
  private setSessionActiveUserInfoHashMap: SetterOrUpdater<
    Map<string, SessionActiveUserInfoSub>
  > | null = null;
  private isInitialized = false;
  private onInitializedCallbacks: Array<() => void> = [];
  private subscribedChannels: Map<string, StompSubscription> = new Map(); // 구독된 채널을 관리하는 Map

  constructor() {
    this.client = new Client({
      brokerURL: this.getSocketUrl(),
      connectHeaders: {},
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS(this.getSocketUrl()),
      onConnect: this.onConnect,
      onDisconnect: this.onDisconnect,
      onStompError: this.onStompError,
    });
  }

  public activate(
    sessionActiveUserInfoHashMap: Map<string, SessionActiveUserInfoSub>,
    setSessionActiveUserInfoHashMap: SetterOrUpdater<
      Map<string, SessionActiveUserInfoSub>
    >,
  ): void {
    this.sessionActiveUserInfoHashMap = sessionActiveUserInfoHashMap;
    this.setSessionActiveUserInfoHashMap = setSessionActiveUserInfoHashMap;
    this.client.activate();
    this.client.onConnect = () => {
      this.isInitialized = true;
      this.onInitializedCallbacks.forEach((callback) => callback());
      this.onInitializedCallbacks = [];
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
  }

  private onConnect = (frame: any) => {
    this.requestInitialData();
    console.log('Connected: ', frame);
  };

  private onDisconnect = (frame: any) => {
    console.log('Disconnected: ', frame);
  };

  private onStompError = (frame: any) => {
    console.error('STOMP Error: ', frame);
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
    this.client.publish({ destination, body: messageString });
  }

  private requestInitialData() {
    // Subscribe to the initial data channel
    const myAccountSetting: ProfileMyInfo = getMyAccountSettingInfo();

    this.client.subscribe(
      `${API_SESSIONS_PATH}/${myAccountSetting.userId}`,
      (message: IMessage) => {
        const sessionActiveUserInfoSubList: SessionActiveUserListSub =
          JSON.parse(message.body) as SessionActiveUserListSub;
        console.log('Received initial DTO: ', sessionActiveUserInfoSubList);
        this.saveSessionActiveInfo(sessionActiveUserInfoSubList);

        this.client.subscribe(
          `${SESSION_BROKER_PATH}/${myAccountSetting.userId}`,
          (message: IMessage) => {
            const sessionActiveUserInfoSubList: SessionActiveUserListSub =
              JSON.parse(message.body) as SessionActiveUserListSub;
            console.log('Received initial DTO: ', sessionActiveUserInfoSubList);
            this.saveSessionActiveInfo(sessionActiveUserInfoSubList);
          },
        );
      },
    );
  }

  private saveSessionActiveInfo = (
    sessionActiveUserInfoSubList: SessionActiveUserListSub,
  ) => {
    if (
      this.sessionActiveUserInfoHashMap &&
      this.setSessionActiveUserInfoHashMap
    ) {
      const newSessionActiveUserInfoHashMap = new Map(
        this.sessionActiveUserInfoHashMap,
      );

      sessionActiveUserInfoSubList.sessionActiveUserInfoSubList.forEach(
        (sessionActiveUserInfo) => {
          newSessionActiveUserInfoHashMap.set(
            sessionActiveUserInfo.userId,
            sessionActiveUserInfo,
          );
        },
      );

      this.setSessionActiveUserInfoHashMap(newSessionActiveUserInfoHashMap);
    }
  };
}

const webSocketService = new WebSocketService();
export default webSocketService;
