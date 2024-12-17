import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
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
  onClose: () => void;
  isTouchScrollBar?: boolean;
  hasTransparentOverLay?: boolean;
  hasFixedActive?: boolean;
  headerBorderRadiusNum?: number;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({
  children,
  popupOverLayContainerStyle,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  onClose,
  isTouchScrollBar = true,
  hasTransparentOverLay = false,
  hasFixedActive = true,
  headerBorderRadiusNum = 15,
}) => {
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const touchRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    setTranslateY(0);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      document.body.style.overscrollBehavior = 'none'; // Prevent overscroll behavior

      if (deltaY > 0) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          setTranslateY(deltaY * 1.5);
        });
      }

      e.stopPropagation();
      e.preventDefault();
    },
    [startY],
  );

  const handleTouchEnd = () => {
    document.body.style.overscrollBehavior = 'auto'; // Prevent overscroll behavior
    if (translateY > 100) {
      requestAnimationFrame(() => {
        setTranslateY(window.innerHeight);
        setTimeout(() => {
          onClose();
          setTranslateY(0);
        }, 150);
      });
    } else {
      requestAnimationFrame(() => {
        setTranslateY(0);
      });
    }
  };

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM);
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  useEffect(() => {
    if (!hasFixedActive) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    // document.body.style.top = `0px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    document.body.style.overflow = OVERFLOW_HIDDEN;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = OVERFLOW_DEFAULT;
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [hasFixedActive]);

  useEffect(() => {
    const element = touchRef.current;
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    if (element) {
      element.addEventListener('touchmove', preventDefault as EventListener, {
        passive: false,
      });
    }
    return () => {
      if (element) {
        element.removeEventListener(
          'touchmove',
          preventDefault as EventListener,
        );
      }
    };
  }, []);

  return (
    <PopupLayoutOverlay
      $translateY={translateY}
      onClick={() => onClose()}
      style={popupOverLayContainerStyle}
      $hasTransparentOverLay={hasTransparentOverLay}
    >
      <PopupContainer $translateY={translateY} style={popupContainerStyle}>
        <PopupWrap
          style={popupWrapStyle}
          $headerBorderRadiusNum={headerBorderRadiusNum}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PopupContentWrap style={popupContentWrapStyle}>
            {isMobile && isTouchScrollBar && (
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
    </PopupLayoutOverlay>
  );
};

const PopupLayoutOverlay = styled.div<{
  $translateY: number;
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
  overflow: hidden;
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
  transition: transform 0.1s ease-out;
  transform: translate3d(0, ${({ $translateY }) => $translateY}px, 0);
  will-change: transform;
  touch-action: none;
  overflow: hidden;
`;

const PopupWrap = styled.div<{ $headerBorderRadiusNum: number }>`
  bottom: 0;
  z-index: 1000;
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  height: 100%;
  background: white;
  border-radius: ${(props) => props.$headerBorderRadiusNum}px
    ${(props) => props.$headerBorderRadiusNum} 0 0;
  overflow: hidden;
  animation: ${animationStyle.slideUp} 0.15s ease-in-out;
`;

const PopupContentWrap = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: auto;
`;

const PopupScrollBar = styled.div`
  position: fixed;
  transform: translate(-50%, 0px);
  left: 50%;
  height: 4px;
  width: 50px;
  z-index: 1000;
  border-radius: 3px;
  margin-top: 7px;
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

const PopupTopBodyBottomScrollArea = styled.div`
  z-index: 10;
  position: absolute;
  height: ${({ theme }) =>
    theme.systemSize.popupTopBodyBottomScrollArea.height};
  width: 100%;
`;

const PopupTopBodyBottomScrollHeader = styled.div``;

export default PopupLayout;
