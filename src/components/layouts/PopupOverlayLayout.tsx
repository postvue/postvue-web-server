import BodyHiddenScrollElement from 'components/BodyHiddenScrollElement';
import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface PopupOverLayLayoutProps {
  PopupOverLayLayoutStyle?: React.CSSProperties;
  children: React.ReactNode;
  isLight: boolean;
}

const PopupOverLayLayout: React.FC<PopupOverLayLayoutProps> = ({
  children,
  PopupOverLayLayoutStyle,
  isLight,
}) => {
  return (
    <PopupOverLayLayoutContainer
      style={PopupOverLayLayoutStyle}
      $isLight={isLight}
    >
      {children}
      <BodyHiddenScrollElement />
    </PopupOverLayLayoutContainer>
  );
};

const PopupOverLayLayoutContainer = styled.div<{ $isLight: boolean }>`
  position: fixed;
  z-index: 3000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: ${(props) =>
    props.$isLight
      ? theme.background.lightBlurBackground
      : 'rgba(0, 0, 0, 0.5)'};
`;

export default PopupOverLayLayout;
