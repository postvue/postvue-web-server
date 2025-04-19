import {
  BRIDGE_EVENT_ROUTE_TYPE,
  BridgeMsgInterface,
  EVENT_DATA_ROUTE_AND_MOVE_URL_TYPE,
  EventDateInterface,
  RouteAndMoveUrlInfoType,
} from 'const/ReactNativeConst';
import { isApp } from 'global/util/reactnative/nativeRouter';

export const handleMessageByRouteAndMoveUrl = (
  event: MessageEvent,
  onFunc: (url: string) => void,
): void => {
  if (!isApp()) return;
  try {
    const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

    if (nativeEvent.type === BRIDGE_EVENT_ROUTE_TYPE) {
      const eventData: EventDateInterface = nativeEvent.data;

      if (eventData.eventType === EVENT_DATA_ROUTE_AND_MOVE_URL_TYPE) {
        const data: RouteAndMoveUrlInfoType = JSON.parse(eventData.data);
        onFunc(data.moveUrl);
      }
    }
  } catch (error) {
    console.error('Failed to parse message:', event.data);
  }
};
