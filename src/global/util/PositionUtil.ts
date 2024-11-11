interface getPosition {
  latitude: number;
  longitude: number;
}

export const getCurrentPosition = (
  actionFunc: (position: getPosition) => void,
): void => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      actionFunc({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
      throw new Error('위치 정보를 가져오는 데 실패했습니다.');
    },
  );
};
