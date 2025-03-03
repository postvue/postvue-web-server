import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

import {
  WEBSOCKET_HEARTBEAT_INCOMING_TIME,
  WEBSOCKET_HEARTBEAT_OUTGOING_TIME,
  WEBSOCKET_RECONNECT_DELAY_TIME,
} from 'const/WebSocketConfigConst';
import { ACCESS_TOKEN_EXPIRED_ERROR_STOMP_DELIVERY_MESSAGE } from 'const/WebSocketStompErrorConst';
import { getAccessTokenByBearer } from 'global/util/AuthUtil';
import { getAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { handleWebSocketStomp } from 'services';
import { WEBSOCKET_ENDPOINT_URL } from './websocketServicePath';

class WebSocketService {
  private static instance: WebSocketService | null;
  protected client: Client;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
      onStompError: this.onStompError,
    });
  }
  public static getInstance(): WebSocketService | null {
    if (isApp()) {
      return null;
    }
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
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

  private onStompError = async (frame: any) => {
    if (ACCESS_TOKEN_EXPIRED_ERROR_STOMP_DELIVERY_MESSAGE === frame.body) {
      await handleWebSocketStomp(() => {
        this.disconnect();
        this.activateConnect();
      }).catch((e) => {
        console.error(e);
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

  public deleteSubscribe(destination: string): void {
    const subscription = this.subscribedChannels.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscribedChannels.delete(destination);
      console.log(`Unsubscribed from ${destination}`);
    } else {
      console.warn(`No subscription found for ${destination}`);
    }
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
const webSocketService: WebSocketService | null =
  WebSocketService.getInstance();
export default webSocketService;
