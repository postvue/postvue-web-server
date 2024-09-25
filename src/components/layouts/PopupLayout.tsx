import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import { throttle } from 'lodash';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface PopupLayoutProps {
  children: ReactNode;
  popupOverLayContainerStyle?: React.CSSProperties;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  isTouchScrollBar?: boolean;
  hasTransparentOverLay?: boolean;
  hasFixedActive?: boolean;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({
  children,
  popupOverLayContainerStyle,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  setIsPopup,
  isTouchScrollBar = true,
  hasTransparentOverLay = false,
  hasFixedActive = true,
}) => {
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const touchRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

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

      e.stopPropagation(); // 터치 이동 이벤트가 부모에게 전파되지 않도록
    }, 16),
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
    if (!hasFixedActive) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = OVERFLOW_HIDDEN;

    return () => {
      console.log(originalOverflow);
      //@REFER: 참고 바람
      // document.body.style.overflow = originalOverflow;
      document.body.style.overflow = OVERFLOW_DEFAULT;
    };
  }, []);

  useEffect(() => {
    // const element = touchRef.current;
    // const preventDefault = (e: TouchEvent) => e.preventDefault();
    // if (element) {
    //   // DOM 이벤트 리스너 추가
    //   element.addEventListener('touchmove', preventDefault as EventListener, {
    //     passive: false,
    //   });
    // }
    // return () => {
    //   if (element) {
    //     // DOM 이벤트 리스너 제거
    //     element.removeEventListener(
    //       'touchmove',
    //       preventDefault as EventListener,
    //       { passive: false },
    //     );
    //   }
    // };
  }, []);

  return (
    <PopupLayoutOverlay
      $translateY={translateY}
      onClick={() => setIsPopup(false)}
      style={popupOverLayContainerStyle}
      $hasTransparentOverLay={hasTransparentOverLay}
    >
      <PopupContainer $translateY={translateY} style={popupContainerStyle}>
        <PopupWrap
          style={popupWrapStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PopupContentWrap style={popupContentWrapStyle}>
            {isTouchScrollBar && (
              <PopupTopBodyBottomScrollArea
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                ref={touchRef}
              >
                <PopupTopBodyBottomScrollHeader />
                <PopupScrollBar />
              </PopupTopBodyBottomScrollArea>
            )}

            {children}
          </PopupContentWrap>
        </PopupWrap>
      </PopupContainer>
      {/* @REFER: 현재 주석 처리 했으나 나중에 문제 발생할 수 있으닌 참고 바람 */}
      {/* {hasFixedActive && <BodyFixScrollElement />} */}
    </PopupLayoutOverlay>
  );
};

const PopupLayoutOverlay = styled.div<{
  $translateY: number;
  $hasTransparentOverLay: boolean;
}>`
  position: fixed;
  z-index: 1000;
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
    ${(props) => Math.max(0, 0.5 - props.$translateY / 1000)}
  );
  ${(props) => props.$hasTransparentOverLay && 'background: rgba(0,0,0,0)'};
`;

const PopupContainer = styled.div<{ $translateY: number }>`
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
  transform: translate3d(0, ${({ $translateY }) => $translateY}px, 0);
  will-change: transform;
  touch-action: auto; /* 터치 동작 허용 */
`;

const PopupWrap = styled.div`
  bottom: 0;
  z-index: 1000;
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
  animation: ${animationStyle.slideUp} 0.15s ease-in-out;
`;

const PopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  overflow-y: auto; /* 내부 스크롤 허용 */
  -webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤 */
  touch-action: auto; /* 터치 동작 허용 */
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
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

const PopupTopBodyBottomScrollArea = styled.div`
  z-index: 10;
  position: fixed;
  height: ${({ theme }) =>
    theme.systemSize.popupTopBodyBottomScrollArea.height};
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
`;

const PopupTopBodyBottomScrollHeader = styled.div``;

export default PopupLayout;
