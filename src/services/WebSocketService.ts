import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export abstract class WebSocketService {
  protected client: Client;

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

  disconnect(): void {
    this.client.deactivate();
  }

  private onConnect = (frame: any) => {
    console.log('Connected: ', frame);
  };

  private onDisconnect = (frame: any) => {
    console.log('Disconnected: ', frame);
  };

  private onStompError = (frame: any) => {
    console.error('STOMP Error: ', frame);
  };

  protected getSocketUrl(): string {
    throw new Error('getSocketUrl must be implemented in the subclass');
  }
}
