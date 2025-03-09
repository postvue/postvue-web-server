import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { OVERFLOW_HIDDEN, POSITION_FIXED } from 'const/AttributeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isFixScrollToPostDetailPopupAtom } from 'states/PostAtom';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';

interface ProfilePostDetailPopupProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  touchHeaderHeightNum?: number;
  isExternalCloseFunc?: boolean;
  isActiveExternalPopup: boolean;
  bottomSheetCloseOffsetThreshold?: number;
  bottomSheetCloseAccelerThreshold?: number;
  opacityForPreventFlickerThreshold?: number;
  isProcessingSideScroll: boolean;
  prevOnClose: () => void;
  ScrollRef: React.RefObject<HTMLDivElement>;
}

const ProfilePostDetailPopupLayout: React.FC<ProfilePostDetailPopupProps> = ({
  children,
  isOpen,
  onClose,
  touchHeaderHeightNum = 50,
  isExternalCloseFunc,
  isActiveExternalPopup,
  bottomSheetCloseOffsetThreshold = 50,
  bottomSheetCloseAccelerThreshold = 1.2,
  isProcessingSideScroll,
  prevOnClose,
  ScrollRef,
}) => {
  const isFixScrollToPostDetailPopup = useRecoilValue(
    isFixScrollToPostDetailPopupAtom,
  );

  const BottomSheetPopupRef = useRef<HTMLDivElement>(null);
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const height = window.innerHeight;

  const [{ y }, api] = useSpring(() => ({ y: height }));
  const [{ sheetY }] = useSpring(() => ({ sheetY: height }));

  const [startY, setStartY] = useState<number>(0);
  const [move, setMove] = useState<number | null>(null);

  const [scrollY, setScrollY] = useState<number>(0);

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

  const [prevY, setPrevY] = useState<number | null>(null); // 이전 위치
  const [prevTime, setPrevTime] = useState<number | null>(null); // 이전 시간
  const [prevVelocity, setPrevVelocity] = useState<number | null>(null); // 이전 속도
  const ACCELERATION_THRESHOLD = 0.5; // 임계값 설정
  const [accelerationHistory, setAccelerationHistory] = useState<number[]>([]);

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
        onClose();
      },
    });

    funcRemoveParentFix();
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
    if (oy <= 0 || dy < 0 || !isScrollTop || isFixScrollToPostDetailPopup) {
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

      if (isAtTop && !isExternalCloseFunc && !isActiveExternalPopup && dy > 0) {
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

  const display = y.to((py) => (py < height ? 'contents' : 'none'));

  const bgStyle = {
    background: y.to((value) => `rgba(255, 255, 255, ${1 - value / height})`),
  };

  const isRemoveFixRef = useRef<boolean>(false);
  const funcRemoveParentFix = () => {
    if (isRemoveFixRef.current) return;

    const userAgent = navigator.userAgent;

    // iPhone 또는 iOS인지 확인
    if (!/iPhone|iPad|iPod/.test(userAgent)) {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.documentElement.style.touchAction = 'auto';
      document.documentElement.style.overscrollBehavior = 'auto';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo({ top: scrollY });
    } else {
      unlock([], { useGlobalLockState: true });
    }

    // document.documentElement.style.touchAction = '';
    // if (!isHiddenOverflow) {
    //   document.body.style.overflow = '';
    // }

    // document.body.style.touchAction = '';
    // document.documentElement.style.overscrollBehavior = '';

    // document.body.style.overscrollBehavior = '';
    // document.body.style.top = '';
    // document.body.style.left = '';
    // document.body.style.right = '';

    // if (!isFixedPostion) {
    //   document.body.style.position = '';
    // }
    isRemoveFixRef.current = true;
  };

  useEffect(() => {
    if (isOpen) {
      open({ canceled: false });

      if (
        !ScrollRef.current ||
        !BottomSheetContainerRef.current ||
        !BottomSheetPopupRef.current
      )
        return;

      // iPhone 또는 iOS인지 확인
      const userAgent = navigator.userAgent;

      if (!/iPhone|iPad|iPod/.test(userAgent)) {
        const y = window.scrollY;

        document.body.style.overflow = OVERFLOW_HIDDEN;
        document.body.style.position = POSITION_FIXED;
        document.documentElement.style.touchAction = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
        document.body.style.width = '100%';
        // document.body.style.top = `-${y}px`;
        document.body.style.left = '0px';
        document.body.style.right = '0px';

        setScrollY(y);
      } else {
        lock([
          ScrollRef.current,
          BottomSheetContainerRef.current,
          BottomSheetPopupRef.current,
        ]);
      }

      // isFixedPostion = document.body.style.position === POSITION_FIXED;
      // isHiddenOverflow = document.body.style.overflow === OVERFLOW_HIDDEN;

      // document.documentElement.style.touchAction = 'none';
      // if (!isHiddenOverflow) {
      //   document.body.style.overflow = OVERFLOW_HIDDEN;
      // }

      // document.body.style.touchAction = 'none';
      // document.documentElement.style.overscrollBehavior = 'none';

      // document.body.style.overscrollBehavior = 'none';
      // setScrollY(window.scrollY);
      // setOpacityForPreventFlicker(0);

      // document.body.style.top = `-${window.scrollY}px`;
      // document.body.style.left = '0px';
      // document.body.style.right = '0px';

      // if (!isFixedPostion) {
      //   document.body.style.position = 'fixed';
      // }

      // setOpacityForPreventFlicker(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
  }, [isExternalCloseFunc]);

  useEffect(() => {
    return () => {
      funcRemoveParentFix();
    };
  }, []);

  return (
    <BottomSheetLayoutConatiner
      ref={BottomSheetPopupRef}
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
        as={animated.div}
        style={{
          ...{
            bottom: `calc(-100vh + ${height}px)`,
            y: y,
          },
        }}
      >
        {/* <PopupScrollContainer
          as={animated.div}
          $bottomSheetHeightNum={touchHeaderHeightNum}
          {...scrollBarbind()}
        >
          <PopupScrollBar>
            <PopupScrollBarArea>
              <PopupScrollStickBar />
            </PopupScrollBarArea>
          </PopupScrollBar>
        </PopupScrollContainer> */}

        <BottomSheetWrap
          ref={ScrollRef}
          $heightNum={height}
          as={animated.div}
          {...sheetBind()}
          onTouchStart={(e) => {
            setStartY(e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (isProcessingSideScroll) return;

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
                    const averageAcceleration =
                      updatedHistory.reduce((a, b) => a + b, 0) /
                      updatedHistory.length;

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
          onTouchEnd={() => {
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
          {children}
        </BottomSheetWrap>
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
  height: 100vh;
  position: fixed;
  overflow: hidden;
  z-index: 900;
  top: 0;
  left: 0;
  width: 100%;
  // height: 100%;
  background-color: white;
`;

const BottomSheetContainer = styled.div`
  z-index: 990;
  position: fixed;
  height: calc(100vh);
  width: 100%;

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

  user-select: none;
  -webkit-user-drag: none;
  touch-action: auto;
`;

const PopupScrollContainer = styled.div<{ $bottomSheetHeightNum: number }>`
  position: absolute;

  height: ${(props) => props.$bottomSheetHeightNum}px;
  width: calc(100% - 100px);
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1000;
  display: flex;
`;

const PopupScrollBar = styled.div`
  border-radius: 3px;
  display: flex;
  margin: 0 auto 0 auto;
`;

const PopupScrollBarArea = styled.div`
  padding: 7px 18px 70px 18px;
  height: 4px;
  width: 50px;
  border-radius: 3px;
`;

const PopupScrollStickBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  height: 100%;
  border-radius: 5px;
`;

const BottomSheetHeader = styled.div``;

const BottomSheetBottomWrap = styled.div``;

export default ProfilePostDetailPopupLayout;
