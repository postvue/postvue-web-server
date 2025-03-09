import { IMessage } from '@stomp/stompjs';

import { ActiveUserSession } from 'global/db/db';
import { SessionActiveUserListSub } from 'global/interface/session';
import { convertDate } from 'global/util/DateTimeUtil';
import {
  API_SESSIONS_PATH,
  SESSION_BROKER_PATH,
} from 'services/websocket/websocketServicePath';
import webSocketService from '../WebSocketService';

export class SessionWsService {
  // private sessionActiveUserInfoHashMap: Map<
  //   string,
  //   SessionActiveUserInfoSub
  // > | null = null;
  // private setSessionActiveUserInfoHashMap: SetterOrUpdater<
  //   Map<string, SessionActiveUserInfoSub>
  // > | null = null;
  private appDestination: string | null = null;
  private brokerDestination: string | null = null;
  private putActiveUserSessions:
    | ((messages: Omit<ActiveUserSession, 'id'>[]) => Promise<void>)
    | null = null;

  connect(
    channelUserId: string,
    // sessionActiveUserInfoHashMap: Map<string, SessionActiveUserInfoSub>,
    // setSessionActiveUserInfoHashMap: SetterOrUpdater<
    //   Map<string, SessionActiveUserInfoSub>
    // >,
    putActiveUserSessions: (
      messages: Omit<ActiveUserSession, 'id'>[],
    ) => Promise<void>,
  ): void {
    // this.sessionActiveUserInfoHashMap = sessionActiveUserInfoHashMap;
    // this.setSessionActiveUserInfoHashMap = setSessionActiveUserInfoHashMap;
    this.putActiveUserSessions = putActiveUserSessions;

    if (webSocketService !== null) {
      webSocketService.addOnInitializedCallback(() => {
        this.appDestination = `${API_SESSIONS_PATH}/${channelUserId}`;
        if (webSocketService === null) return;
        webSocketService.setSubscribe(
          this.appDestination,
          (message: IMessage) => {
            const sessionActiveUserInfoSubList: SessionActiveUserListSub =
              JSON.parse(message.body) as SessionActiveUserListSub;

            this.saveSessionActiveInfo(sessionActiveUserInfoSubList);
          },
        );

        this.brokerDestination = `${SESSION_BROKER_PATH}/${channelUserId}`;
        webSocketService.setSubscribe(
          this.brokerDestination,
          (message: IMessage) => {
            const sessionActiveUserInfoSubList: SessionActiveUserListSub =
              JSON.parse(message.body) as SessionActiveUserListSub;

            this.saveSessionActiveInfo(sessionActiveUserInfoSubList);
          },
        );
      });
    }
  }

  disconnect(): void {
    if (webSocketService === null) return;
  }

  // private saveSessionInfoAndBroadCast = (
  //   sessionActiveUserInfoSubList: SessionActiveUserListSub,
  // ) => {
  //   this.saveSessionActiveInfo(sessionActiveUserInfoSubList);
  //   websocketBroadcastChannel.postMessage({
  //     type: WEBSOCKET_BROADCAST_MESSAGE_TYPES.WEBSOCKET_CHANNEL_SESSION_TYPE,
  //     data: sessionActiveUserInfoSubList,
  //   } as WebsocketBroadcastMessage);
  // };

  public saveSessionActiveInfo = (
    sessionActiveUserInfoSubList: SessionActiveUserListSub,
  ): void => {
    if (!this.putActiveUserSessions) return;

    this.putActiveUserSessions(
      sessionActiveUserInfoSubList.sessionActiveUserInfoSubList.map((v) => {
        const activeUserSession: ActiveUserSession = {
          id: v.userId,
          userId: v.userId,
          sessionState: v.sessionState,
          lastActivityDateTime: convertDate(v.lastActivityDateTime),
        };
        return activeUserSession;
      }),
    );
  };
}

const sessionWsService = new SessionWsService();
export default sessionWsService;
