import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import webSocketService from '../../services/WebSocketService';
import { sessionActiveUserInfoHashMapAtom } from '../../states/SessionAtom';

const AppInitConfig: React.FC = () => {
  const [sessionActiveUserInfoHashMap, setSessionActiveUserInfoHashMap] =
    useRecoilState(sessionActiveUserInfoHashMapAtom);

  useEffect(() => {
    if (!webSocketService.isWebSocketInitialized()) {
      webSocketService.activate(
        sessionActiveUserInfoHashMap,
        setSessionActiveUserInfoHashMap,
      );
    }

    return () => {
      if (webSocketService.isWebSocketInitialized()) {
        webSocketService.disconnect();
      }
    };
  });
  return <></>;
};

export default AppInitConfig;
