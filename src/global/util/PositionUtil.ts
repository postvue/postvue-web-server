import {
  BRIDGE_EVENT_GEOLOCATION_TYPE,
  BridgeMsgInterface,
  EVENT_DATA_GEOLOCATION_CURRENT_POS_TYPE,
  EventDateInterface,
  GeolocationCurrentPos,
} from 'const/ReactNativeConst';
import {
  isApp,
  sendGeolocationCurrentPositionEvnet,
} from './reactnative/nativeRouter';

interface CurrentPositionProps {
  actionFunc: (position: { latitude: number; longitude: number }) => void;
  onClose?: () => void;
  isAlertError?: boolean;
}

export const getUnifiedPosition = (
  currentPositionProps: CurrentPositionProps,
  isPosRequest = true,
): void => {
  if (isApp()) {
    // ✅ 앱에서 실행 (React Native → WebView로 메시지 요청)
    sendGeolocationCurrentPositionEvnet(isPosRequest);

    // ✅ 앱에서 받은 위치 정보 처리
    const receiveMessage = (event: MessageEvent) => {
      if (!isApp()) return;
      try {
        const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

        if (nativeEvent.type === BRIDGE_EVENT_GEOLOCATION_TYPE) {
          const eventData: EventDateInterface = nativeEvent.data;
          if (eventData.eventType === EVENT_DATA_GEOLOCATION_CURRENT_POS_TYPE) {
            const data: GeolocationCurrentPos = JSON.parse(eventData.data);
            if (data.latitude && data.longitude) {
              currentPositionProps.actionFunc({
                latitude: data.latitude,
                longitude: data.longitude,
              });
            }
          }
        }
      } catch (error) {
        if (currentPositionProps.onClose) {
          currentPositionProps.onClose();
        }
        if (currentPositionProps.isAlertError) {
          alert('위치 정보를 가져오는 데 실패했습니다.' + error);
        }
      }
    };

    // ✅ 이벤트 리스너 추가 및 제거 (클린업)
    window.addEventListener('message', receiveMessage);
    setTimeout(() => {
      if (currentPositionProps.onClose) {
        currentPositionProps.onClose();
      }

      window.removeEventListener('message', receiveMessage);
    }, 3000);
  } else {
    // ✅ 웹에서 실행 (기존 `getCurrentPosition` 사용)
    getCurrentPosition(currentPositionProps);
  }
};

const getCurrentPosition = (
  currentPositionProps: CurrentPositionProps,
): void => {
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        if (
          permissionStatus.state === 'granted' ||
          permissionStatus.state === 'prompt'
        ) {
          fetchPosition(
            currentPositionProps.actionFunc,
            currentPositionProps.isAlertError,
            currentPositionProps.onClose,
          );
        } else {
          if (currentPositionProps.onClose) {
            currentPositionProps.onClose();
          }
          alert(
            '위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.',
          );
        }
      })
      .catch(() => {
        alert('권한 상태를 확인할 수 없습니다.');
      });
  } else {
    // navigator.permissions를 지원하지 않는 브라우저 대응
    fetchPosition(
      currentPositionProps.actionFunc,
      currentPositionProps.isAlertError,
      currentPositionProps.onClose,
    );
  }
};

let watchId: number | null = null;
const fetchPosition = (
  actionFunc: (position: { latitude: number; longitude: number }) => void,
  isAlertError?: boolean,
  onClose?: () => void,
): void => {
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      actionFunc(position.coords);

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId); // 최초 한번만 얻고 중지
        watchId = null;
      }
    },
    (error) => {
      if (onClose) {
        onClose();
      }
      if ((isAlertError === undefined && true) || isAlertError) {
        alert('위치 정보를 가져오는 데 실패했습니다.' + error.message);
      }
    },
    {
      enableHighAccuracy: true, // 고정밀 GPS 요청
      maximumAge: Infinity,
    },
  );
  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     actionFunc({
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //     });
  //   },
  //   (error) => {
  //     if (onClose) {
  //       onClose();
  //     }
  //     if ((isAlertError === undefined && true) || isAlertError) {
  //       alert('위치 정보를 가져오는 데 실패했습니다.' + error.message);
  //     }
  //   },
  // );
};

// export const getCurrentPositionAsync = async (): Promise<{
//   latitude: number;
//   longitude: number;
// }> => {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         resolve({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (error) => {
//         reject(error);
//       },
//     );
//   });
// };

export const getPosInfoByGis = async (
  latitude: number,
  longitude: number,
): Promise<LocationInfo> => {
  const a = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  );
  return (await a.json()) as LocationInfo;
};

interface LocationInfo {
  city: string;
  continent: string;
  continentCode: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  locality: string;
  localityInfo: {
    administrative: {
      name: string;
      description: string;
      isoName?: string;
      order: number;
      adminLevel: number;
      wikidataId?: string;
    }[];
  };
  informative?: {
    name: string;
    description: string;
    wikidataId?: string;
  }[];
  localityLanguageRequested: string;
  longitude: number;
  lookupSource: string;
  plusCode: string;
  postcode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
}
