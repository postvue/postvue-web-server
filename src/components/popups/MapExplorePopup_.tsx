import { animated, config, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import GeoCurrentPositionButton from 'components/mapexplore/GeoCurrentPositionButton';
import GeoPositionRefreshButton from 'components/mapexplore/GeoPositionRefreshButton';
import MapExploreBody from 'components/mapexplore/MapExploreBody';
import { GeoPositionInterface } from 'global/util/MapExploreUtil';
import { QueryStateMapAddressByGeo } from 'hook/queryhook/QueryStateMapAddressByGeo';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { mapLoactionAtom, mapMoveLoactionAtom } from 'states/MapExploreAtom';
import styled from 'styled-components';

interface MapExplorePopupProps {
  onChangeNaverMap?: (mapLocation: GeoPositionInterface) => void;
  touchHeaderHeightNum?: number;
  bottomSheetCloseOffsetThreshold?: number;
  bottomSheetCloseAccelerThreshold?: number;
  popupTopHeight?: number;
  popupMiddleRatio?: number;
  popupBottomGap?: number;
}

const MapExplorePopup_: React.FC<MapExplorePopupProps> = ({
  onChangeNaverMap,
  touchHeaderHeightNum = 50,
  bottomSheetCloseOffsetThreshold = 30,
  bottomSheetCloseAccelerThreshold = 1.2,
  popupTopHeight = 60,
  popupMiddleRatio = 1 / 2,
  popupBottomGap = 110,
}) => {
  const MyCurrentGeoButtonRef = useRef<HTMLDivElement>(null);

  const BottomSheetContainerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const ScrollRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [bottomHeight, setBottomHeight] = useState<number>(0);

  const popupMiddleHeight =
    window.innerHeight * popupMiddleRatio - popupTopHeight;
  const popupBottomHeight =
    window.innerHeight - popupTopHeight - popupBottomGap;

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
    setPopupPosition(0);
  };

  const goToMiddle = ({ canceled }: { canceled: boolean }) => {
    if (!ScrollRef.current) return;
    api.start({
      y: popupMiddleHeight,
      immediate: false,
      config: canceled ? config.default : config.default,
    });
    ScrollRef.current.style.overflow = 'hidden';
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
        console.log('헤에');
        if (
          !(
            (dy > 0 && isScrollTop && popupPosition <= 0) ||
            (popupPosition > 0 && oy > 0)
          )
        ) {
          console.log('무엇');
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
        console.log('아항');
        api.start({ y: popupPosition });
        setPopupPosition(popupPosition);
      }
    }
    // 드래그 하고 있는 지?
    else {
      console.log('여기 인가?', oy, dy);
      if (
        (dy > 0 && isScrollTop && popupPosition <= 0) ||
        (popupPosition > 0 && oy > 0)
      ) {
        api.start({ y: oy, config: config.gentle });
      }
    }
  };

  const [test, setTest] = useState<string>('');
  const [testEnd, setTestEnd] = useState<string>('');

  const scrollBarbind = useDrag(
    ({
      last,
      velocity: [, vy],
      direction: [, dy],
      offset: [, oy],
      canceled,
    }) => {
      console.log(dy);
      if (last) {
        // 위로 스크롤 하는 지?
        console.log('스크롤 위치:', oy, dy);
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
    goToMiddle({ canceled: false });
  }, []);

  const [mapLocation, setMapLocation] = useRecoilState(mapLoactionAtom);
  QueryStateMapAddressByGeo(mapLocation.latitude, mapLocation.longitude);

  const [mapMoveLocation, setMapMoveLoation] =
    useRecoilState(mapMoveLoactionAtom);

  useEffect(() => {
    setMapMoveLoation({
      latitude: mapLocation.latitude,
      longitude: mapLocation.longitude,
      isMoved: false,
    });
  }, [mapLocation]);

  const bgStyle = {
    opacity: y.to([0, popupMiddleHeight], [0, 1], 'clamp'),
  };

  return (
    <BottomSheetLayoutConatiner as={animated.div}>
      {/* <OverlayBackground
        as={animated.div}
        onClick={() => close()}
        style={bgStyle}
      /> */}

      <BottomSheetContainer
        ref={BottomSheetContainerRef}
        as={animated.div}
        style={{
          bottom: `calc(-100lvh + ${height - popupTopHeight}px)`,
          y: y,
          // borderRadius: y.to([0, height], ['0px', '15px 15px 0 0']),
        }}
      >
        <animated.div style={bgStyle}>
          <GeoCurrentPositionButton
            GeoCurrentPositionButtonRef={MyCurrentGeoButtonRef}
            onChangeNaverMap={onChangeNaverMap}
            GeoCurrentButtonStyle={{
              position: 'fixed',
              right: '0px',
              top: '-50px',
              margin: '0 15px 15px 0',
            }}
          />
        </animated.div>
        {mapMoveLocation.isMoved && (
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
          {/* <div style={{ background: 'lavender', height: '77px' }}>
            <div style={{ color: '#ff10e6' }}>{test}</div>
            <div style={{ color: '#ff0404' }}>{testEnd}</div>
          </div> */}
        </PopupScrollContainer>

        <BottomSheetWrap
          ref={ScrollRef}
          $heightNum={height - headerHeight - bottomHeight}
          as={animated.div}
          {...sheetBind()}
          onTouchStart={(e) => {
            console.log('첫', e.touches[0].clientY);
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
            setTest(
              `첫 위치: ${startY}    
              이동: ${popupPosition + scrollMove}, ${popupPosition} 
              가속도: ${Math.max(...accelerationHistory)}     
              팝업 위치가 중간 인지: ${popupPosition} ${popupMiddleHeight} ${popupPosition >= popupMiddleHeight}    
              방향 (밑으로 인지): ${bindInfo.dy} ${bindInfo.dy > 0}
              `,
            );

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

            setPrevY(currentY); // 위치 갱신
            setPrevTime(currentTime); // 시간 갱신
            setMove(popupPosition + scrollMove);
          }}
          onTouchEnd={(e) => {
            console.log('최종 이동:', move);
            console.log('가속도', Math.max(...accelerationHistory));

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

            setPrevY(null);
            setPrevTime(null);
            setPrevVelocity(null);
            setMove(null);
            setAccelerationHistory([]);

            setTestEnd(
              `
              최종 이동: ${move}     
              가속도: ${Math.max(...accelerationHistory)}   
              위치: ${popupPosition}
              `,
            );
          }}
        >
          <MapExploreBody
            latitude={mapLocation.latitude}
            longitude={mapLocation.longitude}
          />
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

const OverlayBackground = styled.div`
  height: 100lvh;
  position: fixed;
  overflow: hidden;
  z-index: 900;
  top: 0;
  left: 0;
  width: 100%;
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

export default MapExplorePopup_;
