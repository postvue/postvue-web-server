import loadingBarGif from 'assets/images/gif/loadingBar.gif';
import PopupOverLayLayout from 'components/layouts/PopupOverlayLayout';
import React from 'react';
import styled from 'styled-components';

const LoadingPopup: React.FC = () => {
  return (
    <PopupOverLayLayout>
      <LoadingWrap>
        <LoadingGif src={loadingBarGif} />
      </LoadingWrap>
    </PopupOverLayLayout>
  );
};

const LoadingBarSize = 50;

const LoadingWrap = styled.div`
  position: fixed;
  top: calc(50% - ${LoadingBarSize}px);
  left: 50%;
  transform: translate(-50%, 50%);
`;

const LoadingGif = styled.img`
  width: ${LoadingBarSize}px;
  height: ${LoadingBarSize}px;
`;

export default LoadingPopup;
