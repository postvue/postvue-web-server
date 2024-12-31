import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface ProfilePostDetailPopupProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  touchHeaderHeightNum?: number;
  isExternalCloseFunc?: boolean;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
  isActiveExternalPopup: boolean;
  bottomSheetCloseOffsetThreshold?: number;
  bottomSheetCloseAccelerThreshold?: number;
  opacityForPreventFlickerThreshold?: number;
}

const ProfilePostDetailPopupLayout: React.FC<ProfilePostDetailPopupProps> = ({
  children,
  isOpen,
  onClose,
  touchHeaderHeightNum = 50,
  isExternalCloseFunc,
  setIsExternalCloseFunc,
  isActiveExternalPopup,
  bottomSheetCloseOffsetThreshold = 50,
  bottomSheetCloseAccelerThreshold = 1.2,
  opacityForPreventFlickerThreshold = 0.83,
}) => {
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const height = window.innerHeight;
  const [scrollY, setScrollY] = useState<number>(0);
  const ScrollRef = useRef<HTMLDivElement>(null);

  const [{ y }, api] = useSpring(() => ({ y: height }));
  const [{ sheetY }] = useSpring(() => ({ sheetY: height }));

  const [startY, setStartY] = useState<number>(0);
  const [move, setMove] = useState<number | null>(null);

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
      config: canceled
        ? config.wobbly
        : { tension: 300, friction: 15, mass: 5, clamp: true },
    });
  };

  const close = () => {
    api.start({
      y: height,
      immediate: false,
      config: { tension: 300, friction: 15, mass: 5, clamp: true },
      onRest: () => {
        setOpacityForPreventFlicker(0);
        onClose();
      },
    });

    // document.documentElement.style.overflow = '';
    document.documentElement.style.touchAction = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.documentElement.style.overscrollBehavior = '';
    // @REFER 문제 되면 주석 풀기
    // document.body.style.overscrollBehavior = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.position = '';
    window.scrollTo({ top: scrollY });
    setTimeout(() => {
      setOpacityForPreventFlicker(0.4);
    }, 80);
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

  const [test, setTest] = useState<string>('');

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

      if (isAtTop && !isExternalCloseFunc && !isActiveExternalPopup && dy > 0) {
        setIsScrollTop(isAtTop);
        setBindInfo({
          oy: oy - height,
          dy: dy,
          vy: vy,
          cancel: cancel,
          canceled: !!canceled,
        });
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

  const [opacityForPreventFlicker, setOpacityForPreventFlicker] = useState<
    number | null
  >(null);

  // const bgStyle = {
  //   opacity: y.to(
  //     [0, height],
  //     [
  //       1,
  //       opacityForPreventFlicker == null
  //         ? opacityForPreventFlickerThreshold
  //         : opacityForPreventFlicker,
  //     ],
  //     'clamp',
  //   ),
  // };

  const bgStyle = {
    opacity: y.to([0, height], [1, 0], 'clamp'),
  };
  useEffect(() => {
    console.log('열림: ' + isOpen);
    if (isOpen) {
      open({ canceled: false });
      // document.documentElement.style.overflow = OVERFLOW_HIDDEN;
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = OVERFLOW_HIDDEN;
      document.body.style.touchAction = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      // @REFER 문제 되면 주석 풀기
      // document.body.style.overscrollBehavior = 'none';
      setScrollY(window.scrollY);
      setOpacityForPreventFlicker(0);
      setTimeout(() => {
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.left = '0px';
        document.body.style.right = '0px';
        document.body.style.position = 'fixed';
        setOpacityForPreventFlicker(null);
      }, 400);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isExternalCloseFunc) return;
    close();
    if (setIsExternalCloseFunc) {
      setIsExternalCloseFunc(false);
    }
  }, [isExternalCloseFunc]);

  useEffect(() => {
    return () => {
      console.log('킹킹킹');
      // document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overscrollBehavior = '';
      // @REFER 문제 되면 주석 풀기
      // document.body.style.overscrollBehavior = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.position = '';

      console.log('킹킹킹스');
    };
  }, []);

  return (
    <BottomSheetLayoutConatiner as={animated.div} style={{ display: display }}>
      <OverlayBackground
        as={animated.div}
        onClick={() => close()}
        // @REFER: 주석 처리함 잠깐 -> 테스트 목적
        style={bgStyle}
      />
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        style={{
          bottom: `calc(-100lvh + ${height}px)`,
          y: y,
        }}
      >
        <PopupScrollContainer
          as={animated.div}
          $bottomSheetHeightNum={touchHeaderHeightNum}
          {...scrollBarbind()}
        >
          <PopupScrollBar>
            <PopupScrollBarArea>
              <PopupScrollStickBar />
            </PopupScrollBarArea>
          </PopupScrollBar>
          <div>{test}</div>
        </PopupScrollContainer>

        <BottomSheetWrap
          ref={ScrollRef}
          $heightNum={height}
          as={animated.div}
          {...sheetBind()}
          onTouchStart={(e) => {
            setStartY(e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            console.log('##################');
            const currentY = e.touches[0].clientY; // 현재 위치
            const currentTime = Date.now();
            console.log('이동', currentY - startY);
            console.log('지금 최상단인지', isScrollTop);
            console.log('방향', bindInfo.dy);

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

                    console.log('평균 가속도:', averageAcceleration);
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

            setTest(
              `첫 위치: ${startY}    이동: ${scrollMove}     가속도: ${Math.max(...accelerationHistory)}`,
            );
            setPrevY(currentY); // 위치 갱신
            setPrevTime(currentTime); // 시간 갱신
            setMove(scrollMove);
          }}
          onTouchEnd={(e) => {
            console.log('최종 이동:', move);
            console.log('가속도', Math.max(...accelerationHistory));

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
  height: 100lvh;
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
  height: calc(100lvh);
  width: 100%;

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

  overscroll-behavior: contain;
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
`;

const BottomSheetHeader = styled.div``;

const BottomSheetBottomWrap = styled.div``;

export default ProfilePostDetailPopupLayout;
