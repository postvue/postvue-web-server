interface CurrentPositionProps {
  actionFunc: (position: { latitude: number; longitude: number }) => void;
  onClose?: () => void;
  isAlertError?: boolean;
}

export const getCurrentPosition = (
  currentPositionProps: CurrentPositionProps,
): void => {
  navigator.permissions
    .query({ name: 'geolocation' })
    .then((permissionStatus) => {
      if (permissionStatus.state === 'granted') {
        // 권한이 이미 승인된 경우 위치 정보 가져오기
        fetchPosition(
          currentPositionProps.actionFunc,
          currentPositionProps.isAlertError,
          currentPositionProps.onClose,
        );
      } else if (permissionStatus.state === 'prompt') {
        // 권한을 요청하는 경우
        fetchPosition(
          currentPositionProps.actionFunc,
          currentPositionProps.isAlertError,
          currentPositionProps.onClose,
        );
      } else {
        // 권한이 거부된 경우
        if (currentPositionProps.onClose) {
          currentPositionProps.onClose();
        }
        alert('위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.');
      }
    })
    .catch(() => {
      alert('권한 상태를 확인할 수 없습니다.');
    });
};

const fetchPosition = (
  actionFunc: (position: { latitude: number; longitude: number }) => void,
  isAlertError?: boolean,
  onClose?: () => void,
): void => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      actionFunc({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      if (onClose) {
        onClose();
      }
      if ((isAlertError === undefined && true) || isAlertError) {
        alert('위치 정보를 가져오는 데 실패했습니다.' + error.message);
      }
    },
  );
};

export const getCurrentPositionAsync = async (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
};

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
