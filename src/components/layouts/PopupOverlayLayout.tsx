import BodyHiddenScrollElement from 'components/BodyHiddenScrollElement';
import React from 'react';
import styled from 'styled-components';

interface PopupOverLayLayoutProps {
  PopupOverLayLayoutStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const PopupOverLayLayout: React.FC<PopupOverLayLayoutProps> = ({
  children,
  PopupOverLayLayoutStyle,
}) => {
  return (
    <PopupOverLayLayoutContainer style={PopupOverLayLayoutStyle}>
      {children}
      <BodyHiddenScrollElement />
    </PopupOverLayLayoutContainer>
  );
};

const PopupOverLayLayoutContainer = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
`;

export default PopupOverLayLayout;
