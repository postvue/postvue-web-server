import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import LoadingComponent from 'components/common/container/LoadingComponent';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { sendPopupEvent } from 'global/util/reactnative/nativeRouter';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';

interface BottomSnapSheetLayoutProps {
  children: React.ReactNode;
  heightNum?: number;
  isOpen: boolean;
  onClose: () => void;
  prevOnClose?: () => void;
  bottomSheetHeader?: React.ReactNode;
  BottomSheetBottom?: React.ReactNode;
  touchHeaderHeightNum?: number;
  isExternalCloseFunc?: boolean;
  hasScrollBar?: boolean;
  isRoundPopup?: boolean;
  bottomSheetCloseOffsetThreshold?: number;
  bottomSheetCloseAccelerThreshold?: number;
  BottomSheetBottomWrapStyle?: React.CSSProperties;
  scrollContainerElementId?: string;
  initDuration?: number;
}

const BottomSnapSheetLayout: React.FC<BottomSnapSheetLayoutProps> = ({
  children,
  heightNum,
  isOpen,
  onClose,
  prevOnClose,
  bottomSheetHeader,
  BottomSheetBottom,
  touchHeaderHeightNum = 30,
  isExternalCloseFunc,
  hasScrollBar = true,
  isRoundPopup = true,
  bottomSheetCloseOffsetThreshold = 50,
  bottomSheetCloseAccelerThreshold = 1.2,
  BottomSheetBottomWrapStyle,
  scrollContainerElementId,
  initDuration = 700,
}) => {
  const BottomSnapSheetLayoutRef = useRef<HTMLDivElement>(null);
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const height = heightNum || 0;
  const [startY, setStartY] = useState<number>(0);
  const [move, setMove] = useState<number | null>(null);
  const [prevY, setPrevY] = useState<number | null>(null); // 이전 위치
  const [prevTime, setPrevTime] = useState<number | null>(null); // 이전 시간
  const [prevVelocity, setPrevVelocity] = useState<number | null>(null); // 이전 속도
  const ACCELERATION_THRESHOLD = 0.5; // 임계값 설정
  const [accelerationHistory, setAccelerationHistory] = useState<number[]>([]);
  const ScrollRef = useRef<HTMLDivElement>(null);
  const BottomSheetHeaderRef = useRef<HTMLDivElement>(null);
  const BottomSheetBottomRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [bottomHeight, setBottomHeight] = useState<number>(0);

  const [isScrollTop, setIsScrollTop] = useState<boolean>(false);

  const [bindInfo, setBindInfo] = useState<{
    oy: number;
    dy: number;
    vy: number;
    cancel: () => void;
    canceled: boolean;
  }>({
    oy: 0,
    dy: 0,
    vy: 0,
    cancel: () => {
      ('');
    },
    canceled: false,
  });

  const [{ y }, api] = useSpring(() => ({ y: height }));
  const [{ sheetY }] = useSpring(() => ({ sheetY: height }));

  const open = ({ canceled }: { canceled: boolean }) => {
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.default,
    });
  };

  const close = () => {
    if (prevOnClose) {
      prevOnClose();
    }
    api.start({
      y: height,
      immediate: false,
      config: { tension: 300, friction: 15, mass: 5, clamp: true },
      onRest: () => {
        onClose(); // 애니메이션이 끝난 후 실행
      },
    });
    removeFixedByClose();
  };

  const binds = (
    isScrollTop: boolean,
    oy: number,
    dy: number,
    vy: number,
    last: boolean,
    cancel: () => void,
    canceled: boolean,
  ) => {
    if (oy <= 0 || dy < 0 || !isScrollTop) {
      if (last) {
        open({ canceled: canceled });
      }
      cancel();
      return;
    }

    if (last) {
      // 드래그 종료 시 스냅 동작
      oy > bottomSheetCloseOffsetThreshold ||
      (vy > bottomSheetCloseAccelerThreshold && dy > 0)
        ? close()
        : open({ canceled: canceled });
    } else {
      // 드래그 중 실시간 위치 업데이트
      api.start({ y: oy, immediate: true });
    }
  };

  const scrollBarbind = useDrag(
    ({
      last,
      velocity: [, vy],
      direction: [, dy],
      offset: [, oy],
      canceled,
    }) => {
      const clampedY = Math.max(0, Math.min(oy, height)); // 위치 클램핑
      if (last) {
        // 드래그 종료 시 스냅 동작
        oy > height * 0.4 || (vy > 1.2 && dy > 0)
          ? close()
          : open({ canceled: !!canceled });
      } else {
        // 드래그 중 실시간 위치 업데이트
        api.start({ y: clampedY, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  );

  const sheetBind = useDrag(
    ({
      last,
      offset: [, oy],
      velocity: [, vy],
      direction: [, dy],
      cancel,
      canceled,
    }) => {
      const scrollRef = ScrollRef.current;

      if (!scrollRef) return;

      // 내부 스크롤이 최상단인지 확인
      const isAtTop = scrollRef.scrollTop <= 0;

      if (last) {
        setIsScrollTop(false);
      }

      ScrollRef.current.style.overflow = 'scroll';
      ScrollRef.current.style.overscrollBehavior = 'contain';

      if (isAtTop && !isExternalCloseFunc && dy > 0) {
        setIsScrollTop(isAtTop);
        setBindInfo({
          oy: oy - height,
          dy: dy,
          vy: vy,
          cancel: cancel,
          canceled: !!canceled,
        });
        ScrollRef.current.style.overflow = 'hidden';
        ScrollRef.current.style.overscrollBehavior = 'none';
      }
    },
    {
      from: () => [0, sheetY.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  );

  const display = y.to((py) => (py < height - 10 ? 'contents' : 'none'));

  const bgStyle = {
    opacity: y.to([0, height], [0.5, 0], 'clamp'),
  };

  const fixedByOpen = () => {
    // react native로 popup 고정 해제 전달

    open({ canceled: false });
    sendPopupEvent(true);
    if (
      BottomSnapSheetLayoutRef.current &&
      ScrollRef.current &&
      BottomSheetBottomRef.current
    ) {
      lock([
        BottomSnapSheetLayoutRef.current,
        ScrollRef.current,
        BottomSheetBottomRef.current,
      ]);
    }
  };

  const isRemoveFixRef = useRef<boolean>(false);
  const removeFixedByClose = () => {
    // react native로 popup 고정 해제 전달

    sendPopupEvent(false);
    if (isRemoveFixRef.current) return;
    unlock([], {
      useGlobalLockState: true,
    });

    isRemoveFixRef.current = true;
  };

  const [init, setInit] = useState<boolean>(false);

  const initTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    initTimerRef.current = setTimeout(() => {
      setInit(true);
    }, initDuration);

    return () => {
      removeFixedByClose();
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // react native로 popup 고정 전달
      fixedByOpen();
    } else {
      // react native로 popup 고정 해제 전달
      removeFixedByClose();
    }
  }, [isOpen]);

  useEffect(() => {
    const headerElement = BottomSheetHeaderRef.current;
    if (!headerElement) return;

    const observer = new ResizeObserver(() => {
      setHeaderHeight(headerElement.clientHeight);
    });

    observer.observe(headerElement);

    return () => observer.disconnect();
  }, [bottomSheetHeader]);

  useEffect(() => {
    const bottomElement = BottomSheetBottomRef.current;
    if (!bottomElement) return;

    const observer = new ResizeObserver(() => {
      setBottomHeight(bottomElement.clientHeight);
    });

    observer.observe(bottomElement);

    return () => observer.disconnect();
  }, [BottomSheetBottom]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
  }, [isExternalCloseFunc]);

  return (
    <BottomSheetLayoutConatiner
      ref={BottomSnapSheetLayoutRef}
      as={animated.div}
      style={{ display: display }}
    >
      <OverlayBackground
        as={animated.div}
        onClick={() => close()}
        style={bgStyle}
      />
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        $isRoundPopup={isRoundPopup}
        as={animated.div}
        style={{ bottom: `calc(-100dvh + ${height - 100}px)`, y: y }}
      >
        {hasScrollBar && (
          <PopupScrollContainer
            as={animated.div}
            $bottomSheetHeightNum={touchHeaderHeightNum}
            {...scrollBarbind()}
          >
            <PopupScrollBar />
          </PopupScrollContainer>
        )}
        <BottomSheetHeader ref={BottomSheetHeaderRef}>
          {bottomSheetHeader}
        </BottomSheetHeader>
        <BottomSheetWrap
          ref={ScrollRef}
          id={scrollContainerElementId}
          $heightNum={
            height -
            (hasScrollBar ? touchHeaderHeightNum : 0) -
            headerHeight -
            bottomHeight
          }
          as={animated.div}
          {...sheetBind()}
          onTouchStart={(e) => {
            setStartY(e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            const currentY = e.touches[0].clientY; // 현재 위치
            const currentTime = Date.now();

            if (prevY !== null && prevTime !== null) {
              const deltaY = currentY - prevY; // 위치 변화량
              const deltaTime = currentTime - prevTime; // 시간 변화량 (초 단위)

              const velocity = deltaY / deltaTime; // 현재 속도 (m/s)

              if (prevVelocity !== null) {
                const acceleration = Math.abs(
                  (velocity - prevVelocity) / deltaTime,
                ); // 가속도 (m/s²)
                if (Math.abs(acceleration) > ACCELERATION_THRESHOLD) {
                  setAccelerationHistory((prev) => {
                    const updatedHistory = [
                      ...prev,
                      Math.abs(acceleration),
                    ].slice(-5);

                    return updatedHistory;
                  });
                }
              }
              setPrevVelocity(velocity); // 속도 갱신
            }

            const scrollMove = currentY - startY;

            binds(
              isScrollTop,
              scrollMove,
              bindInfo.dy,
              0,
              false,
              bindInfo.cancel,
              bindInfo.canceled,
            );

            if (scrollMove > 0) {
              if (isScrollTop) {
                if (ScrollRef.current) {
                  ScrollRef.current.style.overflowY = 'hidden';
                }
              }
            } else if (scrollMove < 0) {
              if (ScrollRef.current) {
                ScrollRef.current.style.overflowY = 'scroll';
              }
            }

            setPrevY(currentY); // 위치 갱신
            setPrevTime(currentTime); // 시간 갱신
            setMove(scrollMove);
          }}
          onTouchEnd={(e) => {
            if (
              ScrollRef.current &&
              ScrollRef.current.style.overflowY === 'hidden'
            ) {
              ScrollRef.current.style.overflowY = 'scroll';
            }

            if (!move) return;

            binds(
              isScrollTop,
              move,
              bindInfo.dy,
              Math.max(...accelerationHistory),
              true,
              bindInfo.cancel,
              bindInfo.canceled,
            );

            setPrevY(null);
            setPrevTime(null);
            setPrevVelocity(null);
            setMove(null);
            setAccelerationHistory([]);
          }}
        >
          <div style={{ display: init ? 'block' : 'none', height: '100%' }}>
            {children}
          </div>

          {!init && (
            <div>
              <LoadingComponent LoadingComponentStyle={{ top: '30%' }} />
            </div>
          )}
        </BottomSheetWrap>
        <BottomSheetBottomWrap
          ref={BottomSheetBottomRef}
          style={BottomSheetBottomWrapStyle}
        >
          {BottomSheetBottom}
        </BottomSheetBottomWrap>
      </BottomSheetContainer>
    </BottomSheetLayoutConatiner>
  );
};

const BottomSheetLayoutConatiner = styled.div`
  z-index: 500;
  width: 100%;
  height: 100%;
`;

const OverlayBackground = styled.div`
  height: 100dvh;
  position: fixed;
  overflow: hidden;
  z-index: 1020;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
`;

const BottomSheetContainer = styled.div<{ $isRoundPopup: boolean }>`
  z-index: 1029;
  position: fixed;
  height: calc(100dvh + 100px);
  width: 100%;
  border-radius: ${(props) => (props.$isRoundPopup ? `20px 20px 0 0` : '0')};
  background: #fff;
  will-change: auto;
  user-select: none;
  overscroll-behavior: none;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  }
`;

const BottomSheetWrap = styled.div<{ $heightNum: number }>`
  height: ${(props) => props.$heightNum}px;
  overflow-y: scroll;

  touch-action: pan-y;
  transform: none;
  user-select: none;
  // touch-action: pan-x;
  will-change: auto;
`;

const PopupScrollContainer = styled.div<{ $bottomSheetHeightNum: number }>`
  height: ${(props) => props.$bottomSheetHeightNum}px;
  width: 100%;
  z-index: 1000;
  display: flex;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 20px 20px 0 0;
`;

const PopupScrollBar = styled.div`
  height: 4px;
  width: 50px;
  border-radius: 3px;
  display: flex;
  margin: 7px auto 0 auto;
  background-color: ${({ theme }) => theme.grey.Grey2};
`;

const BottomSheetHeader = styled.div``;

const BottomSheetBottomWrap = styled.div``;

export default BottomSnapSheetLayout;
