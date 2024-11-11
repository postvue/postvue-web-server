import GeoCurrentPositionButton from 'components/mapexplore/GeoCurrentPositionButton';
import GeoPositionRefreshButton from 'components/mapexplore/GeoPositionRefreshButton';
import MapExploreBody from 'components/mapexplore/MapExploreBody';
import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import {
  POPUP_FULL_SIZE_POSITION,
  POPUP_MIDDLE_SIZE_POSITION,
  POPUP_SMALL_SIZE_POSITION,
} from 'const/MapExploreConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { GeoPositionInterface } from 'global/util/MapExploreUtil';
import { QueryStateMapAddressByGeo } from 'hook/queryhook/QueryStateMapAddressByGeo';
import { throttle } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { mapLoactionAtom, mapMoveLoactionAtom } from 'states/MapExploreAtom';
import styled from 'styled-components';
import { animationStyle } from '../../styles/animations';

interface MapExplorePopupProps {
  MapExplorePopupRef?: React.RefObject<HTMLDivElement>;
  popupOverLayContainerStyle?: React.CSSProperties;
  popupContainerStyle?: React.CSSProperties;
  popupWrapStyle?: React.CSSProperties;
  popupContentWrapStyle?: React.CSSProperties;
  isTouchScrollBar?: boolean;
  hasFixedActive?: boolean;
  onChangeNaverMap?: (mapLocation: GeoPositionInterface) => void;
}

const MapExplorePopup: React.FC<MapExplorePopupProps> = ({
  popupOverLayContainerStyle,
  popupContainerStyle,
  popupContentWrapStyle,
  popupWrapStyle,
  isTouchScrollBar = true,
  hasFixedActive = true,
  MapExplorePopupRef,
  onChangeNaverMap,
}) => {
  const [startY, setStartY] = useState(POPUP_FULL_SIZE_POSITION);
  const [translateY, setTranslateY] = useState(POPUP_MIDDLE_SIZE_POSITION);
  const tranlateYRef = useRef<number>(translateY);
  const animationFrameRef = useRef<number | null>(null);
  const touchRef = useRef<HTMLDivElement | null>(null);
  const MyCurrentGeoButtonRef = useRef<HTMLDivElement>(null);

  const [mapLocation, setMapLocation] = useRecoilState(mapLoactionAtom);
  const { data } = QueryStateMapAddressByGeo(
    mapLocation.latitude,
    mapLocation.longitude,
  );

  const [mapMoveLocation, setMapMoveLoation] =
    useRecoilState(mapMoveLoactionAtom);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    setMapMoveLoation({
      latitude: mapLocation.latitude,
      longitude: mapLocation.longitude,
      isMoved: false,
    });
  }, [mapLocation]);

  const handleTouchMove = useCallback(
    throttle((e: React.TouchEvent<HTMLDivElement>) => {
      const currentY = e.touches[0].clientY;
      console.log('움직임', currentY);
      console.log(startY);
      const deltaY = currentY - startY;
      console.log(deltaY);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        // deltaY가 양수일 때 아래로, 음수일 때 위로 스크롤
        if (deltaY > 0) {
          console.log('밑으로', deltaY * 1.5, translateY + deltaY, translateY);
          setTranslateY((prevTranslateY) => {
            return deltaY * 1.5 > startY
              ? deltaY * 1.5
              : prevTranslateY + deltaY;
          });
          tranlateYRef.current = deltaY * 1.5;
          console.log('으으으:', tranlateYRef.current);
        } else {
          console.log('위로', translateY, deltaY);
          tranlateYRef.current = translateY + deltaY;
          setTranslateY(translateY + deltaY);
        }
      });
      console.log(translateY);

      e.stopPropagation(); // 터치 이동 이벤트가 부모에게 전파되지 않도록
    }, 16),
    [startY],
  );

  const handleTouchEnd = () => {
    if (translateY < 100) {
      requestAnimationFrame(() => {
        setTranslateY(Math.min(window.innerHeight, POPUP_FULL_SIZE_POSITION));

        console.log('호잇4', window.innerHeight);
      });
    } else if (
      translateY >= 100 &&
      translateY < POPUP_SMALL_SIZE_POSITION - 100
    ) {
      requestAnimationFrame(() => {
        setTranslateY(Math.min(window.innerHeight, POPUP_MIDDLE_SIZE_POSITION));
        console.log(
          '호잇3',
          Math.min(window.innerHeight, POPUP_MIDDLE_SIZE_POSITION),
        );
      });
    } else {
      requestAnimationFrame(() => {
        setTranslateY(POPUP_SMALL_SIZE_POSITION);
      });
    }
  };

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
        // 화면 크기가 768px 이상이면 홈페이지로 리다이렉트
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    // 페이지 로드시 크기 확인
    checkSize();

    // 창 크기 변경시 크기 확인
    window.addEventListener('resize', checkSize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

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
    if (translateY < POPUP_FULL_SIZE_POSITION) {
      setTranslateY(POPUP_FULL_SIZE_POSITION);
    } else if (translateY > POPUP_SMALL_SIZE_POSITION) {
      setTranslateY(POPUP_SMALL_SIZE_POSITION);
    }
  }, [translateY]);

  return (
    <PopupLayoutOverlay style={popupOverLayContainerStyle}>
      <PopupContainer
        $translateY={translateY}
        style={popupContainerStyle}
        ref={MapExplorePopupRef}
      >
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
        {mapMoveLocation.isMoved && (
          <GeoPositionRefreshButton
            GeoPositionRefreshButtonStyle={{ position: 'fixed', top: '-50px' }}
          />
        )}

        <PopupWrap
          style={popupWrapStyle}
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
            <MapExploreBodyWrap>
              <MapExploreBody
                latitude={mapLocation.latitude}
                longitude={mapLocation.longitude}
                MapExploreInfiniteScrollStyle={{ marginBottom: '500px' }}
              />
            </MapExploreBodyWrap>
          </PopupContentWrap>
        </PopupWrap>
      </PopupContainer>
      {/* @REFER: 현재 주석 처리 했으나 나중에 문제 발생할 수 있으닌 참고 바람 */}
      {/* {hasFixedActive && <BodyFixScrollElement />} */}
    </PopupLayoutOverlay>
  );
};

const PopupLayoutOverlay = styled.div`
  position: fixed;
  z-index: 150;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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

  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  margin: 0 auto;
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
  position: relative;
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
  position: absolute;
  height: 50px;
  width: 100%;
`;

const PopupTopBodyBottomScrollHeader = styled.div``;

const MapExploreBodyWrap = styled.div`
  margin-top: 30px;
  position: fixed;
  overflow-y: scroll;
  height: 700px;
`;

export default MapExplorePopup;
