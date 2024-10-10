import { IMessage } from '@stomp/stompjs';

import { ProfileMyInfo } from 'global/interface/profile';
import {
  SessionActiveUserInfoSub,
  SessionActiveUserListSub,
} from 'global/interface/session';
import { SetterOrUpdater } from 'recoil';
import {
  API_SESSIONS_PATH,
  SESSION_BROKER_PATH,
} from 'services/websocketServicePath';
import webSocketService from '../WebSocketService';

export class SessionWsService {
  private sessionActiveUserInfoHashMap: Map<
    string,
    SessionActiveUserInfoSub
  > | null = null;
  private setSessionActiveUserInfoHashMap: SetterOrUpdater<
    Map<string, SessionActiveUserInfoSub>
  > | null = null;
  connect(
    myAccountSetting: ProfileMyInfo,
    sessionActiveUserInfoHashMap: Map<string, SessionActiveUserInfoSub>,
    setSessionActiveUserInfoHashMap: SetterOrUpdater<
      Map<string, SessionActiveUserInfoSub>
    >,
  ): void {
    this.sessionActiveUserInfoHashMap = sessionActiveUserInfoHashMap;
    this.setSessionActiveUserInfoHashMap = setSessionActiveUserInfoHashMap;

    webSocketService.addOnInitializedCallback(() => {
      webSocketService.setSubscribe(
        `${API_SESSIONS_PATH}/${myAccountSetting.userId}`,
        (message: IMessage) => {
          const sessionActiveUserInfoSubList: SessionActiveUserListSub =
            JSON.parse(message.body) as SessionActiveUserListSub;
          console.log('Received initial DTO: ', sessionActiveUserInfoSubList);
          this.saveSessionActiveInfo(sessionActiveUserInfoSubList);
        },
      );
      webSocketService.setSubscribe(
        `${SESSION_BROKER_PATH}/${myAccountSetting.userId}`,
        (message: IMessage) => {
          const sessionActiveUserInfoSubList: SessionActiveUserListSub =
            JSON.parse(message.body) as SessionActiveUserListSub;
          console.log(
            'Yarh eceived initial DTO: ',
            sessionActiveUserInfoSubList,
          );
          this.saveSessionActiveInfo(sessionActiveUserInfoSubList);
        },
      );
    });
  }

  disconnect(sessionId: string): void {
    if (webSocketService.isWebSocketInitialized()) {
      webSocketService.deleteSubscribe(sessionId);
    }
  }

  private saveSessionActiveInfo = (
    sessionActiveUserInfoSubList: SessionActiveUserListSub,
  ) => {
    if (
      this.sessionActiveUserInfoHashMap &&
      this.setSessionActiveUserInfoHashMap
    ) {
      console.log('허리업');
      const newSessionActiveUserInfoHashMap = new Map(
        this.sessionActiveUserInfoHashMap,
      );

      console.log('스탠다운,', sessionActiveUserInfoSubList);

      sessionActiveUserInfoSubList.sessionActiveUserInfoSubList.forEach(
        (sessionActiveUserInfo) => {
          newSessionActiveUserInfoHashMap.set(
            sessionActiveUserInfo.userId,
            sessionActiveUserInfo,
          );
        },
      );

      console.log(newSessionActiveUserInfoHashMap);

      this.setSessionActiveUserInfoHashMap(newSessionActiveUserInfoHashMap);
      console.log('예!!!');
    }
  };
}

const sessionWsService = new SessionWsService();
export default sessionWsService;
