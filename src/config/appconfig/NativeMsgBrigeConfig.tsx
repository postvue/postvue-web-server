import { HOME_PATH } from 'const/PathConst';
import {
  BRIDGE_EVENT_ROUTE_TYPE,
  BridgeMsgInterface,
  EVENT_DATA_ROUTE_BACK_TYPE,
  EVENT_DATA_ROUTE_REPLACE_TYPE,
  EVENT_DATA_ROUTE_RESET_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NativeMsgBridgeConfig: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log('brige 연동');
    const handleMessage = (event: MessageEvent) => {
      try {
        const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

        if (nativeEvent.type === BRIDGE_EVENT_ROUTE_TYPE) {
          const eventData: EventDateInterface = nativeEvent.data;

          if (eventData.routeType === EVENT_DATA_ROUTE_BACK_TYPE) {
            navigate(-1);
          } else if (eventData.routeType === EVENT_DATA_ROUTE_RESET_TYPE) {
            window.location.href = HOME_PATH;
          } else if (eventData.routeType === EVENT_DATA_ROUTE_REPLACE_TYPE) {
            navigate(eventData.path, { replace: true });
          } else {
            navigate(eventData.path);
          }
        }
      } catch (error) {
        console.error('Failed to parse message:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  return <></>;
};

export default NativeMsgBridgeConfig;
