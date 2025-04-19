import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
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
  bottomSheetCloseOffsetThreshold = 30,
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

  const [isScrollTop, setIsScrollTop] = useState<boolean>(false);

  const [prevBodyProps, setPrevBodyProps] = useState<Map<string, string>>(
    new Map(),
  );
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

  const moveRef = useRef<number | null>(null);
  const prevYRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const prevVelocityRef = useRef<number | null>(null);
  const accelerationHistoryRef = useRef<number[]>([]);

  const ACCELERATION_THRESHOLD = 0.5; // 임계값 설정

  const open = ({
    canceled,
    onRestFunc = undefined,
  }: {
    canceled: boolean;
    onRestFunc?: () => void;
  }) => {
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.default,
      // config: {
      //   tension: 180, // 낮은 tension으로 빠르게 멈추게
      //   friction: 25,
      //   mass: 1,
      //   // clamp: true,
      // },
      onRest: () => {
        if (onRestFunc) onRestFunc();
      },
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
      // config: {
      //   tension: 180, // 낮은 tension으로 빠르게 멈추게
      //   friction: 20,
      //   mass: 1,
      //   clamp: true,
      // },
      onRest: () => {
        isFixedByDevice(false);
        onClose();
      },
    });
    // api.start({
    //   y: height,
    //   immediate: false,
    //   config: { tension: 300, friction: 15, mass: 5, clamp: true },
    //   onRest: () => {
    //     onClose();
    //   },
    // });
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

  // const scrollBarbind = useDrag(
  //   ({
  //     last,
  //     velocity: [, vy],
  //     direction: [, dy],
  //     offset: [, oy],
  //     canceled,
  //   }) => {
  //     const clampedY = Math.max(0, Math.min(oy, height)); // 위치 클램핑
  //     if (last) {
  //       // 드래그 종료 시 스냅 동작
  //       oy > height * 0.4 || (vy > 1.2 && dy > 0)
  //         ? close()
  //         : open({ canceled: !!canceled });
  //     } else {
  //       // 드래그 중 실시간 위치 업데이트
  //       api.start({ y: clampedY, immediate: true });
  //     }
  //   },
  //   {
  //     from: () => [0, y.get()],
  //     filterTaps: true,
  //     bounds: { top: 0 },
  //     rubberband: true,
  //   },
  // );

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

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFixedByDevice = (isFixed: boolean) => {
    // iPhone 또는 iOS인지 확인
    const userAgent = navigator.userAgent;

    if (!isFixed && isRemoveFixRef.current) return;

    const BODY_PARAM = 'body';
    const HTML_PARAM = 'html';
    const JOINT_PARAM = '_';
    const OVERFLOW_PARAM = 'overflow';
    const TOUCH_ACTION_PARAM = 'touch-action';
    const OVERFLOWSCROLL_BEHAVIOR_PARAM = 'overflowscroll-behavior';

    if (/iPhone|iPad|iPod/.test(userAgent)) {
      if (
        !ScrollRef.current ||
        !BottomSheetContainerRef.current ||
        !BottomSheetPopupRef.current
      )
        return;
      if (isFixed) {
        lock([
          ScrollRef.current,
          BottomSheetContainerRef.current,
          BottomSheetPopupRef.current,
        ]);
      } else {
        isRemoveFixRef.current = true;
        unlock([], { useGlobalLockState: true });
      }
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (isFixed) {
        timerRef.current = setTimeout(() => {
          const y = window.scrollY;
          const props_ = new Map<string, string>();
          props_.set(
            BODY_PARAM + JOINT_PARAM + OVERFLOW_PARAM,
            document.body.style.overflow,
          );
          props_.set(
            HTML_PARAM + JOINT_PARAM + TOUCH_ACTION_PARAM,
            document.documentElement.style.touchAction,
          );
          props_.set(
            HTML_PARAM + JOINT_PARAM + OVERFLOWSCROLL_BEHAVIOR_PARAM,
            document.documentElement.style.overscrollBehavior,
          );

          setPrevBodyProps(props_);

          document.body.style.overflow = OVERFLOW_HIDDEN;
          document.documentElement.style.touchAction = 'none';
          document.documentElement.style.overscrollBehavior = 'none';
        }, 100);
      } else {
        isRemoveFixRef.current = true;

        timerRef.current = setTimeout(() => {
          document.body.style.overflow =
            prevBodyProps.get(BODY_PARAM + JOINT_PARAM + OVERFLOW_PARAM) ||
            'auto';
          document.documentElement.style.touchAction =
            prevBodyProps.get(HTML_PARAM + JOINT_PARAM + TOUCH_ACTION_PARAM) ||
            'auto';
          document.documentElement.style.overscrollBehavior =
            prevBodyProps.get(
              HTML_PARAM + JOINT_PARAM + OVERFLOWSCROLL_BEHAVIOR_PARAM,
            ) || 'auto';
        }, 100);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        open({
          canceled: false,
          onRestFunc: () => {
            isFixedByDevice(true);
          },
        });
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
  }, [isExternalCloseFunc]);

  useEffect(() => {
    return () => {
      isFixedByDevice(false);
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

            if (prevYRef.current !== null && prevTimeRef.current !== null) {
              const deltaY = currentY - prevYRef.current;
              const deltaTime = currentTime - prevTimeRef.current;

              const velocity = deltaY / deltaTime; // 현재 속도 (m/s)

              if (prevVelocityRef.current !== null) {
                const acceleration = Math.abs(
                  (velocity - prevVelocityRef.current) / deltaTime,
                );
                if (Math.abs(acceleration) > ACCELERATION_THRESHOLD) {
                  const updated = [
                    ...accelerationHistoryRef.current,
                    Math.abs(acceleration),
                  ].slice(-5);
                  accelerationHistoryRef.current = updated;
                }
              }
              prevVelocityRef.current = velocity;
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

            prevYRef.current = currentY;
            prevTimeRef.current = currentTime;
            moveRef.current = scrollMove;
          }}
          onTouchEnd={() => {
            if (
              ScrollRef.current &&
              ScrollRef.current.style.overflowY === 'hidden'
            ) {
              ScrollRef.current.style.overflowY = 'scroll';
            }

            if (moveRef.current == null) return;

            const maxAcceleration = Math.max(...accelerationHistoryRef.current);

            binds(
              isScrollTop,
              moveRef.current,
              bindInfo.dy,
              maxAcceleration,
              true,
              bindInfo.cancel,
              bindInfo.canceled,
            );

            // 리셋
            moveRef.current = null;
            prevYRef.current = null;
            prevTimeRef.current = null;
            prevVelocityRef.current = null;
            accelerationHistoryRef.current = [];
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
  height: 100dvh;
  position: fixed;
  overflow: hidden;
  z-index: 990;
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

  will-change: transform;
  transform: translate3d(0, 0, 0);
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

export default ProfilePostDetailPopupLayout;

// const PopupScrollContainer = styled.div<{ $bottomSheetHeightNum: number }>`
//   position: absolute;

//   height: ${(props) => props.$bottomSheetHeightNum}px;
//   width: calc(100% - 100px);
//   left: 50%;
//   transform: translate(-50%, 0);
//   z-index: 1000;
//   display: flex;
// `;

// const PopupScrollBar = styled.div`
//   border-radius: 3px;
//   display: flex;
//   margin: 0 auto 0 auto;
// `;

// const PopupScrollBarArea = styled.div`
//   padding: 7px 18px 70px 18px;
//   height: 4px;
//   width: 50px;
//   border-radius: 3px;
// `;

// const PopupScrollStickBar = styled.div`
//   background-color: ${({ theme }) => theme.grey.Grey2};
//   height: 100%;
//   border-radius: 5px;
// `;

// const BottomSheetHeader = styled.div``;

// const BottomSheetBottomWrap = styled.div``;
