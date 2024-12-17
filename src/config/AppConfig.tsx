import React from 'react';
import DynamicStyleConfig from './appconfig/DynamicStyleConfig';
import KakaoInitConfig from './appconfig/KakaoInitConfig';
import WebSocketInitConfig from './appconfig/WebSocketInitConfig';

const AppConfig: React.FC = () => {
  return (
    <>
      <WebSocketInitConfig />
      <KakaoInitConfig />
      <DynamicStyleConfig />
    </>
  );
};

export default AppConfig;
