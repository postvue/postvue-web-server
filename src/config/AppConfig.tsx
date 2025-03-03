import React from 'react';
import DynamicStyleConfig from './appconfig/DynamicStyleConfig';
import NativeMsgBridgeConfig from './appconfig/NativeMsgBrigeConfig';
import NotificationChannelConfig from './appconfig/NotificationChannelConfig';
import ServiceUsageTimerConfig from './appconfig/ServiceUsageTimerConfig';
import WebSocketInitConfig from './appconfig/WebSocketInitConfig';

const AppConfig: React.FC = () => {
  return (
    <>
      <WebSocketInitConfig />
      <NotificationChannelConfig />
      <DynamicStyleConfig />
      <NativeMsgBridgeConfig />
      <ServiceUsageTimerConfig />
    </>
  );
};

export default AppConfig;
