import { ReactComponent as MyCurrentGeoIcon } from 'assets/images/icon/svg/explore/MyCurrentGeoIcon.svg';
import { MAP_CONTENT_LOCATION_TYPE } from 'const/MapExploreConst';
import { getUnifiedPosition } from 'global/util/PositionUtil';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { mapContentTypeAtom, mapLoactionAtom } from 'states/MapExploreAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';

interface GeoCurrentPositionButtonProps {
  GeoCurrentButtonStyle?: React.CSSProperties;
  buttonSize?: number;
}

const GeoCurrentPositionButton: React.FC<GeoCurrentPositionButtonProps> = ({
  GeoCurrentButtonStyle,
  buttonSize = 39,
}) => {
  const [mapLoaction, setMapLoaction] = useRecoilState(mapLoactionAtom);

  const setMapContentType = useSetRecoilState(mapContentTypeAtom);

  // QueryStateMapAddressByGeo(mapLoaction.latitude, mapLoaction.longitude);
  const setIsLoadingPopup = useSetRecoilState(isLoadingPopupAtom);

  const onClickGeoCurrentButton = async () => {
    setMapContentType(MAP_CONTENT_LOCATION_TYPE);
    setIsLoadingPopup(true);

    // 위치 가져와서, 갱신.
    getUnifiedPosition({
      actionFunc: (position) => {
        setMapLoaction({
          latitude: position.latitude,
          longitude: position.longitude,
          isMoveCenter: true,
        });

        setIsLoadingPopup(false);
      },
      onClose: () => {
        setIsLoadingPopup(false);
      },
    });
  };
  return (
    <GeoCurrentButtonWrap
      $buttonSize={buttonSize}
      onClick={onClickGeoCurrentButton}
      style={GeoCurrentButtonStyle}
    >
      <GeoCurrentButton>
        <MyCurrentGeoIcon />
      </GeoCurrentButton>
    </GeoCurrentButtonWrap>
  );
};

const GeoCurrentButtonWrap = styled.div<{ $buttonSize: number }>`
  z-index: 150;
  position: fixed;
  display: flex;
  width: ${(props) => props.$buttonSize}px;
  height: ${(props) => props.$buttonSize}px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    bottom: -15px;
    left: -15px;
    right: -15px;
    z-index: -1; /* 가상 요소를 버튼 뒤로 배치 */
    background: transparent; /* 투명 */
  }
`;

const GeoCurrentButton = styled.div`
  margin: auto auto;
  display: flex;
`;

export default GeoCurrentPositionButton;
