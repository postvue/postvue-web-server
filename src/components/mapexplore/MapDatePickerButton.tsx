import { ReactComponent as MapDatePickerButtonIcon } from 'assets/images/icon/svg/explore/MapDatePickerButtonIcon.svg';
import { isApp } from 'global/util/reactnative/nativeRouter';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isMapDatePickerPopupAtom,
  isMapDateRangePickerPopupAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';

interface MapDatePickerButtonProps {
  MapDatePickerButtonStyle?: React.CSSProperties;
  buttonSize?: number;
}

const MapDatePickerButton: React.FC<MapDatePickerButtonProps> = ({
  MapDatePickerButtonStyle,
  buttonSize = 39,
}) => {
  const setIsMapDatePickerPopup = useSetRecoilState(isMapDatePickerPopupAtom);

  const setIsMapDateRangePickerPopup = useSetRecoilState(
    isMapDateRangePickerPopupAtom,
  );

  const onClickMapDatePickerButton = async () => {
    if (isApp()) {
      setIsMapDatePickerPopup(true);
    } else {
      setIsMapDateRangePickerPopup(true);
    }
  };
  return (
    <MapDatePickerButtonWrap
      $buttonSize={buttonSize}
      onClick={onClickMapDatePickerButton}
      style={MapDatePickerButtonStyle}
    >
      <MapDatePickerButtonSubWrap>
        <MapDatePickerButtonIcon />
      </MapDatePickerButtonSubWrap>
    </MapDatePickerButtonWrap>
  );
};

const MapDatePickerButtonWrap = styled.div<{ $buttonSize: number }>`
  position: fixed;
  display: flex;
  width: ${(props) => props.$buttonSize}px;
  height: ${(props) => props.$buttonSize}px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;
  padding: 2px;

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

const MapDatePickerButtonSubWrap = styled.div`
  margin: auto auto;
  display: flex;
`;

export default MapDatePickerButton;
