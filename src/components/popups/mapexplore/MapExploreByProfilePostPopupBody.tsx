import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import LoadingPopup from 'components/popups/LoadingPopup';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { getRoundedNumber } from 'global/util/MathUtil';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  mapExploreFilterTabAtom,
  mapLoactionAtom,
  mapMoveLocationAtom,
} from 'states/MapExploreAtom';
import { initPageInfoAtom, isLoadingPopupAtom } from 'states/SystemConfigAtom';

import { ReactComponent as MapExplorePopupCloseButtonIcon } from 'assets/images/icon/svg/explore/MapExplorePopupCloseButtonIcon.svg';
import AppleMapElement from 'components/mapexplore/body/AppleMapElement';
import MapExploreLocationContentBody from 'components/mapexplore/MapExploreLocationContentBody';
import { MAP_CONTENT_LOCATION_TYPE } from 'const/MapExploreConst';
import { PostRsp } from 'global/interface/post';
import { isEmptyObject } from 'global/util/ObjectUtil';
import { isApp } from 'global/util/reactnative/nativeRouter';
import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import { QueryStateMapExploreList } from 'hook/queryhook/QueryStateMapExploreList';
import Skeleton from 'react-loading-skeleton';
import MapExplorePostPopup from './MapExplorePostPopup';

interface MapExploreByProfilePostPopupBodyProps {
  snsPost: PostRsp;
  funcPrevButton: () => void;
  isMobile?: boolean;
  initTime?: number;
}

const POST_MAX_DISTANCE = 1; //1km
const MAP_POPUP_TIME = 800;
const MAP_OPEN_TIME = 300;
const MapExploreByProfilePostPopupBody: React.FC<
  MapExploreByProfilePostPopupBodyProps
> = ({ snsPost, funcPrevButton, isMobile = true, initTime = 500 }) => {
  const [mapLocation, setMapLocation] = useRecoilState(mapLoactionAtom);

  const [mapMoveLocation, setMapMoveLoation] =
    useRecoilState(mapMoveLocationAtom);

  const isLoadingPopup = useRecoilValue(isLoadingPopupAtom);

  const scrollEndEventFunc = (e: mapkit.EventBase<mapkit.Map>) => {
    const { latitude, longitude } = e.target.center;
    const roundedLatitude = getRoundedNumber(latitude, 1e7);
    const roundedLongitude = getRoundedNumber(longitude, 1e7);

    setMapMoveLoation((prev) => ({
      ...prev,
      latitude: roundedLatitude,
      longitude: roundedLongitude,
      isMoved: true,
    }));
  };

  const [init, setInit] = useState<boolean>(false);
  const [initPost, setInitPost] = useState<boolean>(false);

  const initTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initPostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (isEmptyObject(snsPost.location)) return;

    const postMapLoation = {
      latitude: snsPost.location.latitude,
      longitude: snsPost.location.longitude,
      isMoveCenter: true,
    };

    setMapLocation(postMapLoation);

    initPostTimerRef.current = setTimeout(() => {
      setInitPost(true);
    }, initTime + MAP_OPEN_TIME);

    initTimerRef.current = setTimeout(() => {
      setInit(true);
    }, initTime);

    return () => {
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
      }
      if (initPostTimerRef.current) {
        clearTimeout(initPostTimerRef.current);
      }
    };
  }, []);

  const mapExploreFilterTab = useRecoilValue(mapExploreFilterTabAtom);

  const { data: postMapLocation } = QueryStateMapExploreList(
    mapLocation.latitude,
    mapLocation.longitude,
    mapExploreFilterTab,
    null,
    null,
    true,
    POST_MAX_DISTANCE,
  );

  useBodyAdaptProps(
    [
      { key: 'overflow', value: 'hidden' },
      { key: 'position', value: 'fixed' },
      { key: 'top', value: '0' },
      { key: 'bottom', value: '0' },
      { key: 'right', value: '0' },
      { key: 'left', value: '0' },
    ],
    initTime,
    undefined,
    isMobile && !isApp(),
  );

  const ScrollRef = useRef<HTMLDivElement>(null);

  const [initPageInfo, setInitPageInfo] = useRecoilState(initPageInfoAtom);

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        setInitPageInfo((prev) => ({ ...prev, isMapPopupByProfilePost: true }));
      }, MAP_POPUP_TIME);
    });
  }, []);

  return (
    <>
      <MapExplorePopupContainer>
        {init && (
          <MapExploreHeaderWrap>
            <Search>
              <SearchContainer>
                <SearchWrap>
                  <SearchSS>
                    <SearchSubWrap>
                      <SearchAddressWrap>
                        {snsPost.location.address
                          ? snsPost.location.address
                          : snsPost.location.buildName}
                      </SearchAddressWrap>
                    </SearchSubWrap>
                  </SearchSS>
                </SearchWrap>
              </SearchContainer>
            </Search>
            <MapExplorePopupCloseButtonnWrap onClick={funcPrevButton}>
              <MapExplorePopupCloseButtonnSubWrap>
                <MapExplorePopupCloseButtonn>
                  <MapExplorePopupCloseButtonIcon />
                </MapExplorePopupCloseButtonn>
              </MapExplorePopupCloseButtonnSubWrap>
            </MapExplorePopupCloseButtonnWrap>
          </MapExploreHeaderWrap>
        )}

        <MapExploreWrap>
          <MapExploreSubWrap>
            {/* {!isMobile && (
              <>
                <GeoCurrentPositionButtonWrap>
                  <GeoCurrentPositionButton
                    buttonSize={GeoCurrentButtonSize}
                    GeoCurrentButtonStyle={{ position: 'static' }}
                  />
                </GeoCurrentPositionButtonWrap>

                <GeoPositionRefreshButton
                  GeoPositionRefreshButtonStyle={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    bottom: `${GeoButtonMargin}px`,
                  }}
                />
              </>
            )} */}

            {init && initPageInfo.isMapPopupByProfilePost ? (
              <AppleMapElement
                mapPost={postMapLocation}
                initAnnotationTime={1500}
                // isRefresh={
                //   postMapLocation ? postMapLocation?.pages.length <= 0 : false
                // }
                // onSetMapMoveLocation={(moveLocation: MoveLocationType) =>
                //   setMapMoveLoation((prev) => ({
                //     ...prev,
                //     isMoved: moveLocation.isMoved,
                //     latitude: moveLocation.latitude,
                //     longitude: moveLocation.longitude,
                //   }))
                // }
                // scrollEndEventFunc={scrollEndEventFunc}
              />
            ) : (
              <Skeleton height={window.innerHeight} />
            )}
          </MapExploreSubWrap>
        </MapExploreWrap>

        {isMobile ? (
          <>
            {initPost && (
              <MapExplorePostPopup
                isGeoPositionRefreshButton={false}
                isCurrentPosButton={false}
                isLock={true}
                isInitPos={2}
                middelOverflow={'scroll'}
                ScrollRefObject={ScrollRef}
              >
                <MapExploreLocationContentBody
                  latitude={mapLocation.latitude}
                  longitude={mapLocation.longitude}
                  distance={POST_MAX_DISTANCE}
                  funcPrevButton={funcPrevButton}
                  linkPopupInfo={{
                    isLinkPopup: false,
                    isReplaced: true,
                  }}
                  mapContentType={MAP_CONTENT_LOCATION_TYPE}
                  scrollElement={ScrollRef.current || undefined}
                />
              </MapExplorePostPopup>
            )}
          </>
        ) : (
          <MapPostExploreBodyWrap>
            <MapExploreLocationContentBody
              latitude={mapLocation.latitude}
              longitude={mapLocation.longitude}
              distance={POST_MAX_DISTANCE}
              funcPrevButton={funcPrevButton}
              mapContentType={MAP_CONTENT_LOCATION_TYPE}
            />
          </MapPostExploreBodyWrap>
        )}
      </MapExplorePopupContainer>

      {isLoadingPopup && (
        <LoadingPopup LoadingPopupStyle={{ background: 'transparent' }} />
      )}
    </>
  );
};
const MapFullMargin = 10;
const MapExplorePopupContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  height: 100%;
  z-index: 100;
`;

const MapExploreHeaderWrap = styled.div`
  padding-top: env(safe-area-inset-top);
  z-index: 200;
  width: 100%;
  position: absolute;
  display: flex;

  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin-top: ${MapFullMargin}px;
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: fixed;
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    z-index: 1000;
  }
`;

const Search = styled.div`
  height: 60px;
  background-color: transparent;
  left: 50%;
  position: absolute;
  transform: translate(-50%, 0px);
  display: flex;
  width: 250px;
`;

const SearchContainer = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const SearchWrap = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const SearchSS = styled.div`
  display: flex;
  width: 100%;
`;

const SearchSubWrap = styled.div`
  border-radius: 20px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  height: 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;

  font: ${({ theme }) => theme.fontSizes.Body3};
`;

const SearchAddressWrap = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;
`;

const MapExploreWrap = styled.div`
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  height: 100vh;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: static;
    height: 500px;
    margin: 0;
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
  }
`;
const MapExploreSubWrap = styled.div`
  height: 100%;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: relative;
    padding: 0px;
  }
`;

const MapPostExploreBodyWrap = styled.div`
  bottom: 0px;
  background-color: white;
  margin-top: 10px;
  flex: 1;

  overflow: scroll;
  flex-grow: 1;

  bottom: 0px;
`;

const MapExplorePopupCloseButtonnWrap = styled.div`
  position: absolute;
  right: 0px;
  height: 60px;
  display: flex;
`;

const MapExplorePopupCloseButtonnSubWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 40px;
  border: 2px solid white;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  margin: auto 10px auto 0;
`;

const MapExplorePopupCloseButtonn = styled.div`
  display: flex;
  margin: auto;
`;

export default MapExploreByProfilePostPopupBody;
