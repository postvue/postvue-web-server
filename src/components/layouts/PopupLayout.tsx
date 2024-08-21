import React, { ReactNode, useEffect } from 'react';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface PopupLayoutProps {
  children: ReactNode;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
  setIsPopup: SetterOrUpdater<boolean>;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({
  children,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  setIsPopup,
}) => {
  useEffect(() => {
    const bodyElement = document.body;
    bodyElement.style.overflow = 'hidden';

    return () => {
      bodyElement.style.overflow = 'scroll';
    };
  }, []);
  return (
    <PopupContainer
      style={popupContainerStyle}
      onClick={() => {
        const bodyElement = document.body;
        bodyElement.style.overflow = 'scroll';
        setIsPopup(false);
      }}
    >
      <PopupWrap
        style={popupWrapStyle}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <PopupContentWrap style={popupContentWrapStyle}>
          {children}
        </PopupContentWrap>
      </PopupWrap>
    </PopupContainer>
  );
};

const PopupContainer = styled.div`
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  position: fixed;
  z-index: 999;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const PopupWrap = styled.div`
  bottom: 0;
  z-index: 20;

  width: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
  animation: ${animationStyle.slideUp} 0.2s ease-in-out;
`;

const PopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

export default PopupLayout;
