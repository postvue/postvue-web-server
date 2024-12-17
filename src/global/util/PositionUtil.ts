export const getCurrentPosition = (
  actionFunc: (position: { latitude: number; longitude: number }) => void,
  onClose?: () => void,
): void => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      actionFunc({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
      if (onClose) {
        onClose();
      }
      alert('위치 정보를 가져오는 데 실패했습니다.');
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
