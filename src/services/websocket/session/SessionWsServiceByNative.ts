import {
  BRIDGE_EVENT_WEBSOCKET_CHANNEL_TYPE,
  BridgeMsgInterface,
  EVENT_WEBSOCKET_CHANNEL_SESSION_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import { ActiveUserSession } from 'global/db/db';
import { SessionActiveUserListSub } from 'global/interface/session';
import { convertDate } from 'global/util/DateTimeUtil';

export class SessionWsServiceByNative {
  // private sessionActiveUserInfoHashMap: Map<
  //   string,
  //   SessionActiveUserInfoSub
  // > | null = null;
  // private setSessionActiveUserInfoHashMap: SetterOrUpdater<
  //   Map<string, SessionActiveUserInfoSub>
  // > | null = null;
  private putActiveUserSessions:
    | ((messages: Omit<ActiveUserSession, 'id'>[]) => Promise<void>)
    | null = null;

  handleByMsg(
    putActiveUserSessions: (
      messages: Omit<ActiveUserSession, 'id'>[],
    ) => Promise<void>,
  ): (event: MessageEvent) => void {
    this.putActiveUserSessions = putActiveUserSessions;

    const handleMessage = (event: MessageEvent) => {
      try {
        const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

        if (nativeEvent.type === BRIDGE_EVENT_WEBSOCKET_CHANNEL_TYPE) {
          const eventData: EventDateInterface = nativeEvent.data;
          const data = eventData.data;

          if (eventData.eventType === EVENT_WEBSOCKET_CHANNEL_SESSION_TYPE) {
            const sessionActiveUserInfoSubList: SessionActiveUserListSub =
              JSON.parse(data) as SessionActiveUserListSub;

            this.saveSessionActiveInfo(sessionActiveUserInfoSubList);
          }
        }
      } catch (error) {
        console.error('Failed to parse message:', event.data);
      }
    };

    return handleMessage;
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

const sessionWsServiceByNative = new SessionWsServiceByNative();
export default sessionWsServiceByNative;
