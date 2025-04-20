import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface RoundSquarePopupLayoutProps {
  children: ReactNode;
  popupOverLayContainerStyle?: React.CSSProperties;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
  isCloseByOverlay?: boolean;
  onClose: () => void;
  hasTransparentOverLay?: boolean;
  hasFixedActive?: boolean;
  ScrollRef?: React.RefObject<HTMLDivElement>;
}

const RoundSquareCenterPopupLayout: React.FC<RoundSquarePopupLayoutProps> = ({
  children,
  popupOverLayContainerStyle,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  isCloseByOverlay = true,
  onClose,
  hasTransparentOverLay = false,
  hasFixedActive = true,
  ScrollRef,
}) => {
  useEffect(() => {
    if (!hasFixedActive) return;

    document.body.style.overflow = OVERFLOW_HIDDEN;

    return () => {
      document.body.style.overflow = OVERFLOW_DEFAULT;
    };
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  const handleOverlayClick = () => {
    if (!isDragging) {
      onClose();
    }
  };

  return (
    <PopupLayoutOverlay
      onClick={() => {
        isCloseByOverlay && handleOverlayClick();
      }}
      style={popupOverLayContainerStyle}
      $hasTransparentOverLay={hasTransparentOverLay}
    >
      <PopupContainer style={popupContainerStyle}>
        <PopupWrap
          style={popupWrapStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PopupContentWrap style={popupContentWrapStyle} ref={ScrollRef}>
            {React.isValidElement(children)
              ? React.cloneElement(children as ReactElement, {
                  setIsDragging, // 자식 컴포넌트에 드래그 상태 전달
                })
              : children}
          </PopupContentWrap>
        </PopupWrap>
      </PopupContainer>
    </PopupLayoutOverlay>
  );
};

const PopupLayoutOverlay = styled.div<{
  $hasTransparentOverLay: boolean;
}>`
  position: fixed;
  z-index: 1050;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
  ${(props) => props.$hasTransparentOverLay && 'background: rgba(0,0,0,0)'};
`;

const PopupContainer = styled.div`
  z-index: 500;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-out;
  will-change: transform;
  touch-action: auto; /* 터치 동작 허용 */
`;

const PopupWrap = styled.div`
  z-index: 1000;
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  height: calc(100% - 20px);
  background: white;
  border-radius: 30px;
  animation: ${animationStyle.fadeIn} 0.15s ease-in-out;
`;

const headerTopGap = 26;
const PopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: calc(100% - ${headerTopGap}px);
  padding-top: ${headerTopGap}px;
`;

export default RoundSquareCenterPopupLayout;
