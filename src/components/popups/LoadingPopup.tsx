import loadingBarGif from 'assets/images/gif/loadingBar.gif';
import PopupOverLayLayout from 'components/layouts/PopupOverlayLayout';
import React from 'react';
import styled from 'styled-components';

interface LoadingPopupProps {
  LoadingPopupStyle?: React.CSSProperties;
  LoadingWrapStyle?: React.CSSProperties;
  isLight?: boolean;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({
  LoadingPopupStyle,
  LoadingWrapStyle,
  isLight = true,
}) => {
  return (
    <PopupOverLayLayout
      PopupOverLayLayoutStyle={LoadingPopupStyle}
      isLight={isLight}
    >
      <LoadingWrap style={LoadingWrapStyle}>
        <LoadingGif src={loadingBarGif} />
      </LoadingWrap>
    </PopupOverLayLayout>
  );
};

const LoadingBarSize = 50;

const LoadingWrap = styled.div`
  z-index: 1000;
  position: fixed;
  top: calc(50% - ${LoadingBarSize}px);
  left: 50%;

  transform: translate(-50%, -50%);
`;

const LoadingGif = styled.img`
  width: ${LoadingBarSize}px;
  height: ${LoadingBarSize}px;
`;

export default LoadingPopup;
