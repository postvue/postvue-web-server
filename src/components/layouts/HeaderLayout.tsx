import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

interface HeaderLayoutProps {
  children: ReactNode;
  HeaderLayoutStyle?: React.CSSProperties;
  HeaderLayoutRef?: React.RefObject<HTMLDivElement>;
  isInsetTopMatin?: boolean;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  children,
  HeaderLayoutRef,
  HeaderLayoutStyle,
  isInsetTopMatin = true,
}) => {
  const { windowWidth } = useWindowSize();
  return (
    <>
      <HeaderLayoutContainer
        style={HeaderLayoutStyle}
        ref={HeaderLayoutRef}
        $windowWidth={windowWidth}
        $isInsetTopMatin={isInsetTopMatin}
      >
        {children}
      </HeaderLayoutContainer>
    </>
  );
};

const HeaderLayoutContainer = styled.div<{
  $windowWidth: number;
  $isInsetTopMatin: boolean;
}>`
  padding-top: ${(props) =>
    props.$isInsetTopMatin ? `env(safe-area-inset-top)` : '0px'};
  height: ${theme.systemSize.header.height};
  display: flex;
  width: 100%;
  top: 0px;
  z-index: 100;
  background-color: white;
  ${(props) =>
    props.$windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
      ? `
      position:sticky;`
      : `
      position:fixed; 
      max-width:${theme.systemSize.appDisplaySize.maxWidth};
      `}
`;

export default HeaderLayout;
