import BottomNavBar from 'components/BottomNavBar';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import AppleMapElement from 'components/mapexplore/body/AppleMapElement';
import { MoveLocationType } from 'components/mapexplore/body/MapkitClient';
import GeoCurrentPositionButton from 'components/mapexplore/GeoCurrentPositionButton';
import GeoPositionRefreshButton from 'components/mapexplore/GeoPositionRefreshButton';
import MapDateRangePickerPopup from 'components/mapexplore/MapDateRangePickerPopup';
import MapExploreBody from 'components/mapexplore/MapExploreBody';
import MapExploreHeader from 'components/mapexplore/MapExploreHeader';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import LoadingPopup from 'components/popups/LoadingPopup';
import MapDatePickerPopup from 'components/popups/mapexplore/MapDatePickerPopup';
import MapExplorePostPopup from 'components/popups/mapexplore/MapExplorePostPopup';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import {
  OVERFLOW_HIDDEN,
  OVERFLOW_SCROLL,
  POSITION_FIXED,
} from 'const/AttributeConst';
import {
  MAP_CONTENT_LOCATION_TYPE,
  MAP_CONTENT_POST_TYPE,
} from 'const/MapExploreConst';
import {
  BRIDGE_CALENDAR_EVENT_TYPE,
  BridgeMsgInterface,
  CalendarInfo,
  EventDateInterface,
} from 'const/ReactNativeConst';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { MAP_EXPLORE_SELECT_LOCATION_PHARSE_TEXT } from 'const/SystemPhraseConst';
import { EXPLORE_TAB_NAME } from 'const/TabConst';
import {
  convertDate,
  convertDateToCurrentCountryISO,
} from 'global/util/DateTimeUtil';
import { getRoundedNumber } from 'global/util/MathUtil';
import { getPosInfoByGis, getUnifiedPosition } from 'global/util/PositionUtil';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMapExploreList } from 'hook/queryhook/QueryStateMapExploreList';
import { QueryStateMapMyPostList } from 'hook/queryhook/QueryStateMapMyPostList';
import { QueryStatePostMapPostInfinite } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentSearchQueryAtom,
  isActiveMyMapAtom,
  isMapDatePickerPopupAtom,
  isMapDateRangePickerPopupAtom,
  mapContentTypeAtom,
  mapDatePickerPopupInfoAtom,
  mapExploreFilterTabAtom,
  mapLoactionAtom,
  mapMoveLocationAtom,
  mapSearchPostWordAtom,
} from 'states/MapExploreAtom';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import theme from 'styles/theme';

const MapExplorePage: React.FC = () => {
  const [mapLocation, setMapLocation] = useRecoilState(mapLoactionAtom);

  const [mapMoveLocation, setMapMoveLoation] =
    useRecoilState(mapMoveLocationAtom);

  const isLoadingPopup = useRecoilValue(isLoadingPopupAtom);

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      const { latitude, longitude } = JSON.parse(word);

      getPosInfoByGis(latitude, longitude).then((v) => {
        setMapMoveLoation((prev) => ({
          ...prev,
          regionInfo: {
            city: v.city,
            continent: v.continent,
            continentCode: v.continentCode,
            countryCode: v.countryCode,
            countryName: v.countryName,
            locality: v.locality,
          },
        }));
      });
    },
    [],
    1000,
  );

  interface RoundedPosNumberType {
    latitude: number;
    longitude: number;
  }
  const getRoundedNumberFunc = (
    pos: RoundedPosNumberType,
  ): RoundedPosNumberType => {
    const roundedLatitude = getRoundedNumber(pos.latitude, 1e7);
    const roundedLongitude = getRoundedNumber(pos.longitude, 1e7);

    const roundedData = {
      latitude: roundedLatitude,
      longitude: roundedLongitude,
    };

    return roundedData;
  };

  const scrollEndEventFunc = (e: mapkit.EventBase<mapkit.Map>) => {
    const { latitude, longitude } = e.target.center;

    const roundedData = getRoundedNumberFunc({
      latitude: latitude,
      longitude: longitude,
    });

    setMapMoveLoation((prev) => ({
      ...prev,
      latitude: roundedData.latitude,
      longitude: roundedData.longitude,
      isMoved: true,
    }));

    // saveInitGeoPosition({
    //   latitude: roundedLatitude,
    //   longitude: roundedLongitude,
    //   isMoveCenter: false,
    // });
    debouncedGetSearchQuery(JSON.stringify(roundedData));
  };

  const onSetMapMoveLocation = (moveLocation: MoveLocationType) => {
    const roundedData = getRoundedNumberFunc({
      latitude: moveLocation.latitude,
      longitude: moveLocation.longitude,
    });

    setMapMoveLoation((prev) => ({
      ...prev,
      isMoved: moveLocation.isMoved,
      latitude: roundedData.latitude,
      longitude: roundedData.longitude,
    }));

    debouncedGetSearchQuery(JSON.stringify(roundedData));
  };

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    if (windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM) {
      document.body.style.position = POSITION_FIXED;
      document.body.style.overflow = OVERFLOW_HIDDEN;
      document.body.style.width = '100%';
    }

    getUnifiedPosition(
      {
        actionFunc: (position) => {
          setMapLocation({
            latitude: position.latitude,
            longitude: position.longitude,
            isMoveCenter: true,
          });
          getPosInfoByGis(position.latitude, position.longitude).then((v) => {
            setMapMoveLoation((prev) => ({
              ...prev,
              regionInfo: {
                city: v.city,
                continent: v.continent,
                continentCode: v.continentCode,
                countryCode: v.countryCode,
                countryName: v.countryName,
                locality: v.locality,
              },
            }));

            setMapLocation((prev) => ({
              ...prev,
              regionInfo: {
                city: v.city,
                continent: v.continent,
                continentCode: v.continentCode,
                countryCode: v.countryCode,
                countryName: v.countryName,
                locality: v.locality,
              },
            }));
          });
        },
        isAlertError: false,
      },
      false,
    );

    return () => {
      if (windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM) {
        document.body.style.position = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
      }
    };
  }, []);

  const [isMapDatePickerPopup, setIsMapDatePickerPopup] = useRecoilState(
    isMapDatePickerPopupAtom,
  );

  // const { data: mapAddressByGeo } = QueryStateMapAddressByGeo(
  //   mapLocation.latitude,
  //   mapLocation.longitude,
  // );

  // const searchInputHeaderRef = useRef<HTMLDivElement>(null);

  const mapExploreFilterTab = useRecoilValue(mapExploreFilterTabAtom);
  const mapContentType = useRecoilValue(mapContentTypeAtom);

  const mapDatePickerPopupInfo = useRecoilValue(mapDatePickerPopupInfoAtom);

  const { data: postMapLocation } = QueryStateMapExploreList(
    mapLocation.latitude,
    mapLocation.longitude,
    mapExploreFilterTab,
    mapDatePickerPopupInfo.dateInfo.startDate
      ? convertDateToCurrentCountryISO(
          mapDatePickerPopupInfo.dateInfo.startDate,
        )
      : null,
    mapDatePickerPopupInfo.dateInfo.endDate
      ? convertDateToCurrentCountryISO(mapDatePickerPopupInfo.dateInfo.endDate)
      : null,
  );

  const mapSearchPostWord = useRecoilValue(mapSearchPostWordAtom);

  const { data: postMapPost } = QueryStatePostMapPostInfinite(
    mapSearchPostWord,
    mapLocation.latitude,
    mapLocation.longitude,
    mapContentType === MAP_CONTENT_POST_TYPE,
    mapDatePickerPopupInfo.dateInfo.startDate
      ? convertDateToCurrentCountryISO(
          mapDatePickerPopupInfo.dateInfo.startDate,
        )
      : null,
    mapDatePickerPopupInfo.dateInfo.endDate
      ? convertDateToCurrentCountryISO(mapDatePickerPopupInfo.dateInfo.endDate)
      : null,
  );

  const [isActiveMyMap, setIsActiveMyMap] = useRecoilState(isActiveMyMapAtom);

  const { data: mapMyPostList } = QueryStateMapMyPostList(isActiveMyMap);

  const [isMapDateRangePickerPopup, setIsMapDateRangePickerPopup] =
    useRecoilState(isMapDateRangePickerPopupAtom);

  const [currentSearchQuery, setCurrentSearchQuery] = useRecoilState(
    currentSearchQueryAtom,
  );

  // useEffect(() => {
  //   if (!mapAddressByGeo) return;

  //   setCurrentSearchQuery(mapAddressByGeo.address);
  // }, [mapAddressByGeo]);

  const setMapDatePickerPopupInfo = useSetRecoilState(
    mapDatePickerPopupInfoAtom,
  );

  const handleCalendarMessage = (event: MessageEvent) => {
    try {
      const nativeEvent: BridgeMsgInterface = JSON.parse(event.data);

      if (nativeEvent.type === BRIDGE_CALENDAR_EVENT_TYPE) {
        const eventData: EventDateInterface = nativeEvent.data;

        const data: CalendarInfo = JSON.parse(eventData.data);

        setMapDatePickerPopupInfo({
          isActive: true,
          dateInfo: {
            startDate: convertDate(data.startDate),
            endDate: convertDate(data.endDate),
          },
        });
      }
    } catch (error) {
      console.error('Failed to parse message:', event.data);
    }
  };

  useMessageListener(handleCalendarMessage);

  return (
    <>
      <PageHelmentInfoElement
        title={EXPLORE_TAB_NAME}
        ogTitle={EXPLORE_TAB_NAME}
        ogUrl={window.location.href}
        ogDescription={`${APP_SERVICE_NAME} 서비스: ${EXPLORE_TAB_NAME}`}
      />
      <AppBaseTemplate
        hasSearchBodyModule={false}
        hasSearchInputModule={false}
        isAppContainerTopMargin={false}
        isAppInsetTopMargin={false}
        isScrollByAppContainer={false}
        SideContainerStyle={{
          zIndex: 1000,
        }}
        slideBarNode={
          <>
            <MapExploreBody
              MapSnsPostLayoutStyle={{ paddingTop: '15px' }}
              latitude={mapLocation.latitude}
              longitude={mapLocation.longitude}
              mapExploreBodyStyle={{
                overflow: OVERFLOW_SCROLL,
                height: `100%`,
                borderRadius: '20px',
              }}
              masonryLayoutNum={2}
              linkPopupInfo={{
                isLinkPopup: true,
                isReplaced: false,
              }}
            />
          </>
        }
        AppBaseStlye={{ position: 'relative' }}
        AppHeaderNode={
          isMapDateRangePickerPopup && (
            <MapDateRangePickerPopup
              onClose={() => {
                setIsMapDateRangePickerPopup(false);
              }}
              DateRangePickerContainerStyle={{
                marginTop: `${theme.systemSize.header.heightNumber + 20}px`,
              }}
            />
          )
        }
      >
        <MapExplorePageContainer>
          <MapExploreHeader
            MapFullMargin={MapFullMargin}
            address={
              currentSearchQuery || MAP_EXPLORE_SELECT_LOCATION_PHARSE_TEXT
            }
            SearchButtonInputLayoutActiveStyle={
              windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM
                ? {
                    backgroundColor: theme.grey.Grey2,
                  }
                : {
                    backgroundColor: 'white',
                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                  }
            }
            SearchButtonInputLayoutNotActiveStyle={{
              backgroundColor: theme.mainColor.White,
              boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
            }}
          />

          <MapExploreWrap>
            <AppleMapElement
              mapPost={
                isActiveMyMap
                  ? mapMyPostList
                  : mapContentType === MAP_CONTENT_LOCATION_TYPE
                    ? postMapLocation
                    : postMapPost
              }
              // isRefresh={
              //   isActiveMyMap
              //     ? mapMyPostList
              //       ? mapMyPostList.pages.length <= 1
              //       : false
              //     : mapContentType === MAP_CONTENT_LOCATION_TYPE
              //       ? postMapLocation
              //         ? postMapLocation.pages.length <= 1
              //         : false
              //       : postMapPost
              //         ? postMapPost.pages.length <= 1
              //         : false
              // }
              // onSetMapMoveLocation={onSetMapMoveLocation}
              // scrollEndEventFunc={scrollEndEventFunc}
            />
            {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM && (
              <GeoCurrentPositionButtonWrap>
                <GeoCurrentPositionButton
                  buttonSize={GeoCurrentButtonSize}
                  GeoCurrentButtonStyle={{ position: 'static' }}
                />
              </GeoCurrentPositionButtonWrap>
            )}
            {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM && (
              <GeoPositionRefreshButton
                actionFuncToRefresh={() => {
                  setCurrentSearchQuery('');
                }}
                GeoPositionRefreshButtonStyle={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  bottom: `${GeoCurrentButtonSize / 2}px`,
                }}
              />
            )}
          </MapExploreWrap>
          {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
            <MapExplorePostPopup>
              <MapExploreBody
                latitude={mapLocation.latitude}
                longitude={mapLocation.longitude}
              />
            </MapExplorePostPopup>
          )}
        </MapExplorePageContainer>

        <BottomNavBar />

        {isMapDatePickerPopup && <MapDatePickerPopup />}

        {isLoadingPopup && (
          <LoadingPopup LoadingPopupStyle={{ background: 'transparent' }} />
        )}
      </AppBaseTemplate>
    </>
  );
};
const MapFullMargin = 10;
const GeoCurrentButtonSize = 50;
const GetCurrentButtonMargin = 25;

const MapExplorePageContainer = styled.div`
  position: relative;
  z-index: 100;
`;

const MapExploreWrap = styled.div`
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  width: 100%;
  height: 100vh;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: absolute;
    margin: ${MapFullMargin}px 0;
    height: calc(100vh - ${MapFullMargin * 2}px);
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
    overflow: hidden;
  }
`;

const GeoCurrentPositionButtonWrap = styled.div`
  position: absolute;
  padding: ${GetCurrentButtonMargin}px;
  left: 0px;
  bottom: 0px;
`;

export default MapExplorePage;
