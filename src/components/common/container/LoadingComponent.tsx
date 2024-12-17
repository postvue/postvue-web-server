import loadingBarGif from 'assets/images/gif/loadingBar.gif';
import React from 'react';
import styled from 'styled-components';

interface LoadingComponentProps {
  LoadingComponentStyle?: React.CSSProperties;
  LoadingImgStyle?: React.CSSProperties;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  LoadingComponentStyle,
  LoadingImgStyle,
}) => {
  return (
    <SearchLoadingWrap style={LoadingComponentStyle}>
      <SearchLoadingGif src={loadingBarGif} style={LoadingImgStyle} />
    </SearchLoadingWrap>
  );
};

export default LoadingComponent;

const LoadingBarSize = '50px';
const SearchLoadingWrap = styled.div`
  position: absolute;
  top: calc(50%);
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const SearchLoadingGif = styled.img`
  width: ${LoadingBarSize};
  height: ${LoadingBarSize};
`;
