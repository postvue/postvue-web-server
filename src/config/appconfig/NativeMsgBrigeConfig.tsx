import { toByteArray } from 'base64-js';
import { HOME_PATH } from 'const/PathConst';
import {
  BRIDGE_EVENT_IMAGE_NATIVE_UPLOAD_TYPE,
  BRIDGE_EVENT_ROUTE_TYPE,
  BridgeEventImageNativeUploadInfoInterface,
  BridgeMsgInterface,
  EVENT_DATA_ROUTE_BACK_TYPE,
  EVENT_DATA_ROUTE_REPLACE_TYPE,
  EVENT_DATA_ROUTE_RESET_TYPE,
  EventDateInterface,
} from 'const/ReactNativeConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import { uniqueId } from 'lodash';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { nativeUploadImgFileAtom } from 'states/NativeAtom';

const NativeMsgBridgeConfig: React.FC = () => {
  const setNativeUploadImgFile = useSetRecoilState(nativeUploadImgFileAtom);
  const handleMessage = (event: MessageEvent) => {
    try {
      const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

      if (nativeEvent.type === BRIDGE_EVENT_ROUTE_TYPE) {
        const eventData: EventDateInterface = nativeEvent.data;

        if (eventData.eventType === EVENT_DATA_ROUTE_BACK_TYPE) {
          window.history.back();
        } else if (eventData.eventType === EVENT_DATA_ROUTE_RESET_TYPE) {
          window.location.href = HOME_PATH;
        } else if (eventData.eventType === EVENT_DATA_ROUTE_REPLACE_TYPE) {
          window.history.replaceState(null, '', eventData.path); // URL 교체
        } else {
          window.history.pushState(null, '', eventData.path); // URL 추가
        }
      }

      if (nativeEvent.type === BRIDGE_EVENT_IMAGE_NATIVE_UPLOAD_TYPE) {
        const {
          eventType: uploadInfoString,
          path,
          data,
        }: EventDateInterface = nativeEvent.data;
        const fileName = path || uniqueId();

        // Base64를 Uint8Array로 변환
        const byteArray = toByteArray(data);
        const uploadInfo: BridgeEventImageNativeUploadInfoInterface =
          JSON.parse(uploadInfoString);

        const blob = new Blob([byteArray], { type: uploadInfo.mimeType });
        const file = new File([blob], fileName, { type: uploadInfo.mimeType });
        setNativeUploadImgFile({
          imgFile: file,
          imgBlob: blob,
          uploadInfo: uploadInfo,
        });
      }
    } catch (error) {
      console.error('Failed to parse message:', event.data);
    }
  };

  if (isApp()) {
    useMessageListener(handleMessage);
  }

  return <></>;
};

export default NativeMsgBridgeConfig;
