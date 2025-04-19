import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import GeoCurrentPositionButton from 'components/mapexplore/GeoCurrentPositionButton';
import GeoMyLogQueryButton from 'components/mapexplore/GeoMyLogQueryButton';
import GeoPositionRefreshButton from 'components/mapexplore/GeoPositionRefreshButton';
import {
  MAP_EXPLORE_POST_POPUP_BOTTOM_STATE_TYPE,
  MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE,
  MAP_EXPLORE_POST_POPUP_TOP_STATE_TYPE,
} from 'const/MapExploreConst';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isActiveMyMapAtom,
  isClickAnnotationAtom,
  mapExplorePostPopupStateAtom,
  mapLoactionAtom,
  mapMoveLocationAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';

interface MapExplorePostPopupProps {
  children: React.ReactNode;
  touchHeaderHeightNum?: number;
  bottomSheetCloseOffsetThreshold?: number;
  bottomSheetCloseAccelerThreshold?: number;
  popupTopHeight?: number;
  popupMiddleRatio?: number;
  popupBottomGap?: number;
  isCurrentPosButton?: boolean;
  isGeoPositionRefreshButton?: boolean;
  isLock?: boolean;
  isInitPos?: number;
  middelOverflow?: string;
  ScrollRefObject?: React.RefObject<HTMLDivElement>;
}

const MapExplorePostPopup: React.FC<MapExplorePostPopupProps> = ({
  children,
  touchHeaderHeightNum = 50,
  bottomSheetCloseOffsetThreshold = 30,
  bottomSheetCloseAccelerThreshold = 1.2,
  popupTopHeight = 60,
  popupMiddleRatio = 1 / 2,
  popupBottomGap = 110,
  isCurrentPosButton = true,
  isGeoPositionRefreshButton = true,
  isLock = false,
  isInitPos = 1,
  middelOverflow = 'hidden',
  ScrollRefObject,
}) => {
  popupTopHeight =
    popupTopHeight +
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--safe-area-inset-top',
        ),
      ) || 0;
  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);

  const height = window.innerHeight;

  const ScrollRef = ScrollRefObject
    ? ScrollRefObject
    : useRef<HTMLDivElement>(null);

  const popupMiddleHeight = height * popupMiddleRatio - popupTopHeight;
  const popupBottomHeight =
    height -
      popupTopHeight -
      popupBottomGap -
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--safe-area-inset-bottom',
        ),
      ) || 0;

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

  const [popupPosition, setPopupPosition] = useState<number>(0);

  const goToTop = ({ canceled }: { canceled: boolean }) => {
    if (!ScrollRef.current) return;
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.default : config.default,
    });
    ScrollRef.current.style.overflow = 'scroll';
    setMapExplorePostPopupState(MAP_EXPLORE_POST_POPUP_TOP_STATE_TYPE);
    setPopupPosition(0);
  };

  const goToMiddle = ({ canceled }: { canceled: boolean }) => {
    if (!ScrollRef.current) return;
    api.start({
      y: popupMiddleHeight,
      immediate: false,
      config: canceled ? config.default : config.default,
    });
    ScrollRef.current.style.overflow = middelOverflow;
    setMapExplorePostPopupState(MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE);
    setPopupPosition(popupMiddleHeight);
  };
  const goToBottom = ({ canceled }: { canceled: boolean }) => {
    if (!ScrollRef.current) return;
    api.start({
      y: popupBottomHeight,
      immediate: false,
      config: canceled ? config.default : config.default,
    });
    ScrollRef.current.style.overflow = 'hidden';
    setMapExplorePostPopupState(MAP_EXPLORE_POST_POPUP_BOTTOM_STATE_TYPE);
    setPopupPosition(popupBottomHeight);
  };

  const binds = (
    isScrollTop: boolean,
    oy: number,
    dy: number,
    vy: number,
    dragGap: number,
    last: boolean,
    cancel: () => void,
    canceled: boolean,
  ) => {
    // 이동 위치가 상단을 벗어 나는 지?
    if (oy <= 0) {
      if (last) {
        goToTop({ canceled: canceled });
      }
      cancel();
      return;
    }

    // 드래그 종료 인지?
    if (last) {
      // 드래그 행동 움직임 조건 충족 했는 지?
      // 드래그를 어느 정도 이상 움직 였는 지?
      // 가속도가 어느 정도 이상 높은 지?
      if (!ScrollRef.current) return;
      if (
        dragGap > bottomSheetCloseOffsetThreshold ||
        (vy > bottomSheetCloseAccelerThreshold && dy > 0)
      ) {
        if (
          !(
            (dy > 0 && isScrollTop && popupPosition <= 0) ||
            (popupPosition > 0 && oy > 0)
          )
        ) {
          return;
        }

        // 위로 스크롤 하는 지?
        if (dy < 0) {
          if (oy < popupMiddleHeight) {
            goToTop({ canceled: canceled });
          } else if (oy >= popupMiddleHeight && oy < popupBottomHeight) {
            goToMiddle({ canceled: canceled });
          } else {
            goToMiddle({ canceled: canceled });
          }
        }
        // 밑으로 스크롤
        else {
          if (oy >= 0 && oy < popupMiddleHeight) {
            goToMiddle({ canceled: canceled });
          } else if (oy >= popupMiddleHeight && oy < popupBottomHeight) {
            goToBottom({ canceled: canceled });
          } else {
            goToBottom({ canceled: canceled });
          }
        }
      } else {
        api.start({ y: popupPosition });
        setPopupPosition(popupPosition);
      }
    }
    // 드래그 하고 있는 지?
    else {
      if (
        (dy > 0 && isScrollTop && popupPosition <= 0) ||
        (popupPosition > 0 && oy > 0)
      ) {
        api.start({ y: oy, config: config.gentle });
      }
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
      if (last) {
        // 위로 스크롤 하는 지?

        if (dy < 0) {
          if (oy < popupMiddleHeight) {
            goToTop({ canceled: canceled });
          } else if (oy >= popupMiddleHeight && oy < popupBottomHeight) {
            goToMiddle({ canceled: canceled });
          } else {
            goToMiddle({ canceled: canceled });
          }
        }
        // 밑으로 스크롤
        else {
          if (oy >= 0 && oy < popupMiddleHeight) {
            goToMiddle({ canceled: canceled });
          } else if (oy >= popupMiddleHeight && oy < popupBottomHeight) {
            goToBottom({ canceled: canceled });
          } else {
            goToBottom({ canceled: canceled });
          }
        }
      } else {
        // 드래그 중 실시간 위치 업데이트
        api.start({ y: oy, immediate: false });
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

      setIsScrollTop(isAtTop);
      setBindInfo({
        oy: oy - height,
        dy: dy,
        vy: vy,
        cancel: cancel,
        canceled: !!canceled,
      });
    },
    {
      from: () => [0, sheetY.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  );

  useEffect(() => {
    setTimeout(() => {
      if (isInitPos === 0) {
        goToTop({ canceled: false });
      } else if (isInitPos === 1) {
        goToMiddle({ canceled: false });
      } else {
        goToBottom({ canceled: false });
      }
    }, 700);

    if (isLock && ScrollRef.current && BottomSheetContainerRef.current) {
      lock([ScrollRef.current, BottomSheetContainerRef.current]);
    }

    return () => {
      if (isLock) {
        unlock([], {
          useGlobalLockState: true,
        });
      }
    };
  }, []);

  const mapLocation = useRecoilValue(mapLoactionAtom);

  const setMapMoveLoation = useSetRecoilState(mapMoveLocationAtom);

  const setMapExplorePostPopupState = useSetRecoilState(
    mapExplorePostPopupStateAtom,
  );

  const [isClickAnnotation, setIsClickAnnotation] = useRecoilState(
    isClickAnnotationAtom,
  );

  useEffect(() => {
    setMapMoveLoation((prev) => ({
      ...prev,
      latitude: mapLocation.latitude,
      longitude: mapLocation.longitude,
      isMoved: false,
    }));
  }, [mapLocation]);

  useEffect(() => {
    if (isClickAnnotation === null) return;
    if (!isClickAnnotation) {
      goToBottom({ canceled: false });
    } else {
      goToMiddle({ canceled: false });
    }
    setIsClickAnnotation(null);
  }, [isClickAnnotation]);

  const bgStyle = {
    opacity: y.to([0, popupMiddleHeight], [0, 1], 'clamp'),
  };

  const isActiveMyMap = useRecoilValue(isActiveMyMapAtom);

  return (
    <BottomSheetLayoutConatiner as={animated.div}>
      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        style={{
          bottom: `calc(-100dvh + ${height - popupTopHeight}px)`,
          y: y,
          // borderRadius: y.to([0, height], ['0px', '15px 15px 0 0']),
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
        </PopupScrollContainer>

        {isCurrentPosButton && (
          <animated.div style={bgStyle}>
            <GeoCurrentPositionButton
              GeoCurrentButtonStyle={{
                position: 'fixed',
                right: '0px',
                top: '-50px',
                margin: '0 15px 15px 0',
              }}
            />
          </animated.div>
        )}

        {!isActiveMyMap ? (
          <>
            {isGeoPositionRefreshButton && (
              <animated.div style={bgStyle}>
                <GeoPositionRefreshButton
                  GeoPositionRefreshButtonStyle={{
                    position: 'fixed',
                    top: '-50px',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                  }}
                />
              </animated.div>
            )}
          </>
        ) : (
          <animated.div style={bgStyle}>
            <GeoMyLogQueryButton
              GeoMyLogQueryButtonStyle={{
                position: 'fixed',
                top: '-50px',
                left: '50%',
                transform: 'translate(-50%, 0)',
              }}
            />
          </animated.div>
        )}

        <BottomSheetWrap
          ref={ScrollRef}
          $heightNum={height - popupTopHeight}
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
              popupPosition + scrollMove,
              bindInfo.dy,
              0,
              Math.abs(scrollMove),
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
            setMove(popupPosition + scrollMove);
          }}
          onTouchEnd={(e) => {
            if (!move) return;

            binds(
              isScrollTop,
              move,
              bindInfo.dy,
              Math.max(...accelerationHistory),
              Math.abs(move - popupPosition),
              true,
              bindInfo.cancel,
              bindInfo.canceled,
            );
            setIsScrollTop(false);

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
  display: contents;
`;

const BottomSheetContainer = styled.div`
  z-index: 990;
  position: fixed;
  height: calc(100dvh);
  width: 100%;

  background: #fff;
  will-change: auto;
  user-select: none;
  overscroll-behavior: none;

  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  border-radius: 15px 15px 0 0;
`;

const BottomSheetWrap = styled.div<{ $heightNum: number }>`
  margin-top: 17px;
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
  width: 100%;
  z-index: 1000;
  display: flex;
`;

const PopupScrollBar = styled.div`
  border-radius: 3px;
  display: flex;
  margin: 0 auto 0 auto;
  cursor: grab;
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
  border-radius: 10px;
`;

export default MapExplorePostPopup;
