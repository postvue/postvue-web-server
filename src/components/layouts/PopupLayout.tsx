import { throttle } from 'lodash';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SetterOrUpdater } from 'recoil';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface PopupLayoutProps {
  children: ReactNode;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
  setIsPopup:
    | SetterOrUpdater<boolean>
    | React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({
  children,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  setIsPopup,
}) => {
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // 초당 60장 애니메이션 보여주도록
  const handleTouchMove = useCallback(
    throttle((e: React.TouchEvent<HTMLDivElement>) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          setTranslateY(deltaY * 1.5);
        });
      }
    }, 16), // 60FPS 1000 / 60
    [startY],
  );

  const handleTouchEnd = () => {
    if (translateY > 100) {
      requestAnimationFrame(() => {
        setTranslateY(window.innerHeight);
        setTimeout(() => setIsPopup(false), 150);
      });
    } else {
      requestAnimationFrame(() => {
        setTranslateY(0);
      });
    }
  };

  useEffect(() => {
    const bodyElement = document.body;
    bodyElement.style.overflow = 'hidden';

    return () => {
      bodyElement.style.overflow = 'scroll';
    };
  }, []);

  return (
    <PopupLayoutOverlay
      translateY={translateY}
      style={popupContainerStyle}
      onClick={() => {
        const bodyElement = document.body;
        bodyElement.style.overflow = 'scroll';
        setIsPopup(false);
      }}
    >
      <PopupContainer
        translateY={translateY}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <PopupWrap
          style={popupWrapStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PopupContentWrap style={popupContentWrapStyle}>
            <PopupScrollBar />
            {children}
          </PopupContentWrap>
        </PopupWrap>
      </PopupContainer>
    </PopupLayoutOverlay>
  );
};

const PopupLayoutOverlay = styled.div<{ translateY: number }>`
  position: fixed;
  z-index: 500;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background: rgba(
    0,
    0,
    0,
    ${(props) => Math.max(0, 0.5 - props.translateY / 1000)}
  );
`;

const PopupContainer = styled.div<{
  translateY: number;
}>`
  z-index: 500;
  position: fixed;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  transform: translate3d(0, ${({ translateY }) => translateY}px, 0);

  transition: transform 0.3s ease-out;
  will-change: transform;
`;

const PopupWrap = styled.div`
  bottom: 0;
  z-index: 1000;
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
  animation: ${animationStyle.slideUp} 0.15s ease-in-out;
`;

const PopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
`;

const PopupScrollBar = styled.div`
  position: fixed;
  transform: translate(-50%, 0px);
  left: 50%;
  height: 4px;
  width: 14vw;
  z-index: 1000;
  border-radius: 3px;
  margin-top: 7px;
  background-color: ${({ theme }) => theme.grey.Grey1};
`;

export default PopupLayout;
