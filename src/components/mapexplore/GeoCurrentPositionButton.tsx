import { ReactComponent as MyCurrentGeoIcon } from 'assets/images/icon/svg/explore/MyCurrentGeoIcon.svg';
import { GeoPositionInterface } from 'global/util/MapExploreUtil';
import { getCurrentPosition } from 'global/util/PositionUtil';
import { QueryStateMapAddressByGeo } from 'hook/queryhook/QueryStateMapAddressByGeo';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { mapLoactionAtom } from 'states/MapExploreAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import styled from 'styled-components';

interface GeoCurrentPositionButtonProps {
  GeoCurrentPositionButtonRef: React.RefObject<HTMLDivElement>;
  onChangeNaverMap?: (mapLocation: GeoPositionInterface) => void;
  GeoCurrentButtonStyle?: React.CSSProperties;
  buttonSize?: number;
}

const GeoCurrentPositionButton: React.FC<GeoCurrentPositionButtonProps> = ({
  GeoCurrentPositionButtonRef,
  onChangeNaverMap,
  GeoCurrentButtonStyle,
  buttonSize = 39,
}) => {
  const [mapLoaction, setMapLoaction] = useRecoilState(mapLoactionAtom);

  const { data, isLoading, isError, isSuccess } = QueryStateMapAddressByGeo(
    mapLoaction.latitude,
    mapLoaction.longitude,
  );
  const setIsLoadingPopup = useSetRecoilState(isLoadingPopupAtom);

  const onClickGeoCurrentButton = async () => {
    setIsLoadingPopup(true);
    getCurrentPosition((position) => {
      setMapLoaction({
        latitude: position.latitude,
        longitude: position.longitude,
      });
      if (onChangeNaverMap) {
        onChangeNaverMap(position);
      }
      setIsLoadingPopup(false);
    });
  };
  return (
    <GeoCurrentButtonWrap
      ref={GeoCurrentPositionButtonRef}
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
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
`;

const GeoCurrentButton = styled.div`
  margin: auto auto;
  display: flex;
`;

export default GeoCurrentPositionButton;
