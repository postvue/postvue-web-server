import { ReactComponent as MapExplorePopupCloseButtonIcon } from 'assets/images/icon/svg/explore/MapExplorePopupCloseButtonIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import { ACCOUNT_NOT_PROFILE_IMG_PATH } from 'const/AccountConst';
import { MAP_CONTENT_LOCATION_TYPE } from 'const/MapExploreConst';
import {
  MAP_CONTENT_LOCATION_TYPE,
  MAP_CONTENT_POST_TYPE,
} from 'const/MapExploreConst';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { MAP_EXPLORE_ALL_TAB_PARAM } from 'const/TabConfigConst';
import { MapLocalSrchRsp } from 'global/interface/map';
import { getPosInfoByGis } from 'global/util/PositionUtil';
import { isApp } from 'global/util/reactnative/nativeRouter';
import useOutsideClick from 'hook/customhook/useOutsideClick';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { useEffect, useRef, useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { getMapLocation } from 'services/maps/getMapLocation';
import {
  currentSearchQueryAtom,
  isActiveMyMapAtom,
  isMapDatePickerPopupAtom,
  isMapDateRangePickerPopupAtom,
  isMapSearchInputActiveAtom,
  mapContentTypeAtom,
  mapDatePickerPopupInfoAtom,
  mapExploreFilterTabAtom,
  mapLoactionAtom,
  mapMoveLocationAtom,
  mapSearchTempWordAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import MapExploreSearchSuggestBody from './body/MapExploreSearchSuggestBody';
import MapExploreSearchHeader from './header/MapExploreSearchHeader';
import MapDatePickerButton from './MapDatePickerButton';

interface MapExploreHeaderProps {
  address: string;
  SearchButtonInputLayoutActiveStyle?: React.CSSProperties;
  SearchButtonInputLayoutNotActiveStyle?: React.CSSProperties;
  MapFullMargin: number;
  onClickMapPostButton: (
    postSearchQuery: string,
    posData: { latitude: number; longitude: number; isMoveCenter: boolean },
  ) => void;
}

const MapExploreHeader: React.FC<MapExploreHeaderProps> = ({
  address,
  SearchButtonInputLayoutActiveStyle,
  SearchButtonInputLayoutNotActiveStyle,
  MapFullMargin,
  onClickMapPostButton,
}) => {
  const isMapSearchInputActive = useRecoilValue(isMapSearchInputActiveAtom);

  const setIsMapSearchInputActive = useSetRecoilState(
    isMapSearchInputActiveAtom,
  );

  const { windowWidth } = useWindowSize();
  const suggestBodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  useOutsideClick([headerRef, suggestBodyRef], () =>
    setIsMapSearchInputActive(false),
  );

  const mapDatePickerPopupInfo = useRecoilValue(mapDatePickerPopupInfoAtom);

  const profileButtonRef = useRef<HTMLDivElement>(null);

  const [isClickMapProfileButton, setIsClickMapProfileButton] =
    useState<boolean>(false);

  const [isActiveMyMap, setIsActiveMyMap] = useRecoilState(isActiveMyMapAtom);

  const [isMapDatePickerPopup, setIsMapDatePickerPopup] = useRecoilState(
    isMapDatePickerPopupAtom,
  );

  const [isMapDateRangePickerPopup, setIsMapDateRangePickerPopup] =
    useRecoilState(isMapDateRangePickerPopupAtom);
  const { data: myAccountSettingInfo, isFetched: isFetchedByMyAccount } =
    QueryStateMyProfileInfo(true, false);

  const resetMapDatePickerPopupInfo = useResetRecoilState(
    mapDatePickerPopupInfoAtom,
  );

  const resetMapSearchTempWord = useResetRecoilState(mapSearchTempWordAtom);

  useEffect(() => {
    return () => {
      resetMapSearchTempWord();
    };
  }, []);

  const setMapExploreFilterTab = useSetRecoilState(mapExploreFilterTabAtom);

  const setCurrentSearchQuery = useSetRecoilState(currentSearchQueryAtom);
  const setMapContentType = useSetRecoilState(mapContentTypeAtom);
  const setMapLoaction = useSetRecoilState(mapLoactionAtom);

  const setMapSearchTempWord = useSetRecoilState(mapSearchTempWordAtom);
  const [mapMoveLocation, setMapMoveLoation] =
    useRecoilState(mapMoveLocationAtom);

  const onClickGeoPositionRefreshButton = (
    latitude: number,
    longitude: number,
  ) => {
    setMapExploreFilterTab(MAP_EXPLORE_ALL_TAB_PARAM);
    setMapLoaction({
      latitude: latitude,
      longitude: longitude,
      isMoveCenter: true,
    });
    setMapContentType(MAP_CONTENT_LOCATION_TYPE);
  };

  const onClickAddress = (value: MapLocalSrchRsp) => {
    setCurrentSearchQuery(value.roadAddr ? value.roadAddr : value.placeName);
    getPosInfoByGis(value.latitude, value.longitude).then((v) => {
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
    if (value.hasLocation) {
      setIsMapSearchInputActive(false);
      onClickGeoPositionRefreshButton(value.latitude, value.longitude);
      setMapSearchTempWord('');
    } else {
      getMapLocation(value.roadAddr).then((mapLocationRsp) => {
        setIsMapSearchInputActive(false);
        onClickGeoPositionRefreshButton(
          mapLocationRsp.latitude,
          mapLocationRsp.longitude,
        );
        setMapSearchTempWord('');
      });
    }
  };

  return (
    <MapExploreHeaderContainer $MapFullMargin={MapFullMargin}>
      {isFetchedByMyAccount && (
        <MapExploreSearchContainer
          $isColor={
            windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
              ? false
              : isMapSearchInputActive
                ? true
                : false
          }
        >
          <div ref={headerRef}>
            {!isActiveMyMap && (
              <MapExploreSearchHeaderWrap>
                {!isMapSearchInputActive && mapDatePickerPopupInfo.isActive && (
                  <MapExplorePeriosCloseButtonnWrap
                    onClick={() => {
                      resetMapDatePickerPopupInfo();
                    }}
                  >
                    <MapExplorePeriodFilterCloseButtonSubWrap>
                      <MapExplorePopupCloseButton>
                        <MapExplorePopupCloseButtonIcon />
                      </MapExplorePopupCloseButton>
                    </MapExplorePeriodFilterCloseButtonSubWrap>
                  </MapExplorePeriosCloseButtonnWrap>
                )}
                <MapExploreSearchHeader
                  SearchButtonInputLayoutActiveStyle={
                    SearchButtonInputLayoutActiveStyle
                  }
                  SearchButtonInputLayoutNotActiceStyle={
                    SearchButtonInputLayoutNotActiveStyle
                  }
                  address={address}
                  onClickMapPostButton={(postSearchQuery: string) => {
                    onClickMapPostButton(postSearchQuery, {
                      latitude: mapMoveLocation.latitude,
                      longitude: mapMoveLocation.longitude,
                      isMoveCenter: false,
                    });
                  }}
                />
                {!isMapSearchInputActive &&
                  !mapDatePickerPopupInfo.isActive && (
                    <MyProfileImgButtonWrap
                      onClick={() => {
                        setIsClickMapProfileButton(true);
                      }}
                    >
                      <div
                        ref={profileButtonRef}
                        style={{ position: 'relative' }}
                      >
                        <MyProfileImgButton
                          src={
                            myAccountSettingInfo?.profilePath ||
                            ACCOUNT_NOT_PROFILE_IMG_PATH
                          }
                        />
                        {profileButtonRef.current &&
                          isClickMapProfileButton && (
                            <ContextMenuPopup
                              contextMenuRef={profileButtonRef.current}
                              onClose={() => setIsClickMapProfileButton(false)}
                            >
                              <MapProfileSettingContextWrap>
                                <MapProfileSettingTab
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsClickMapProfileButton(false);
                                    setIsActiveMyMap(true);
                                  }}
                                >
                                  <MapProfileSettingTitle>
                                    내 기록 보기
                                  </MapProfileSettingTitle>
                                </MapProfileSettingTab>
                                <MapProfileSettingTab
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsClickMapProfileButton(false);
                                    if (isApp()) {
                                      setIsMapDatePickerPopup(true);
                                    } else {
                                      setIsMapDateRangePickerPopup(true);
                                    }
                                  }}
                                >
                                  <MapProfileSettingTitle>
                                    기간별로 보기
                                  </MapProfileSettingTitle>
                                </MapProfileSettingTab>
                              </MapProfileSettingContextWrap>
                            </ContextMenuPopup>
                          )}
                      </div>
                    </MyProfileImgButtonWrap>
                  )}
                {!isMapSearchInputActive && mapDatePickerPopupInfo.isActive && (
                  <MapExplorePeriosFilterButtonnWrap>
                    <MapDatePickerButton
                      buttonSize={FilterButtonSize}
                      MapDatePickerButtonStyle={{
                        position: 'relative',
                        margin: 'auto 10px auto 0px',
                      }}
                    />
                  </MapExplorePeriosFilterButtonnWrap>
                )}
              </MapExploreSearchHeaderWrap>
            )}
            {isActiveMyMap && (
              <MapExploreSearchHeaderWrap>
                <MapExploreHeaderWrap $MapFullMargin={MapFullMargin}>
                  <Search>
                    <SearchContainer>
                      <SearchWrap>
                        <SearchSS>
                          <SearchSubWrap>
                            <SearchAddressWrap>내 기록 보기</SearchAddressWrap>
                          </SearchSubWrap>
                        </SearchSS>
                      </SearchWrap>
                    </SearchContainer>
                  </Search>
                  <MapExplorePopupCloseButtonnWrap
                    onClick={() => setIsActiveMyMap(false)}
                  >
                    <MapExplorePopupCloseButtonnSubWrap>
                      <MapExplorePopupCloseButton>
                        <MapExplorePopupCloseButtonIcon />
                      </MapExplorePopupCloseButton>
                    </MapExplorePopupCloseButtonnSubWrap>
                  </MapExplorePopupCloseButtonnWrap>
                </MapExploreHeaderWrap>
              </MapExploreSearchHeaderWrap>
            )}
          </div>

          {isMapSearchInputActive && (
            <MapExploreSuggestBodyWrap
              $windowWidthSize={windowWidth}
              $MapFullMargin={MapFullMargin}
              ref={suggestBodyRef}
            >
              <MapExploreSearchSuggestBody
                SearchSuggestBodyContiainerStyle={{
                  backgroundColor: 'transparent',
                }}
                onClickMapPostButton={(postSearchQuery) => {
                  onClickMapPostButton(postSearchQuery, {
                    latitude: mapMoveLocation.latitude,
                    longitude: mapMoveLocation.longitude,
                    isMoveCenter: false,
                  });
                }}
                onClickAddress={onClickAddress}
              />
            </MapExploreSuggestBodyWrap>
          )}
        </MapExploreSearchContainer>
      )}
    </MapExploreHeaderContainer>
  );
};

const FilterButtonSize = 34;

const MapExploreHeaderContainer = styled.div<{ $MapFullMargin: number }>`
  z-index: 200;
  width: 100%;
  position: absolute;
  display: flex;

  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin-top: ${(props) => props.$MapFullMargin}px;
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: fixed;
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    z-index: 1000;
  }
`;

const MapExploreSearchContainer = styled.div<{ $isColor: boolean }>`
  display: flex;
  flex-flow: column;
  width: 100%;
  background-color: ${(props) => (props.$isColor ? 'white' : 'transparent')};
`;

const MapExploreSearchHeaderWrap = styled.div`
  display: flex;
  width: 100%;
  padding-top: env(safe-area-inset-top);
`;

const MapExploreSuggestBodyWrap = styled.div<{
  $windowWidthSize: number;
  $MapFullMargin: number;
}>`
  background-color: white;
  z-index: 160;

  position: static;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  top: ${theme.systemSize.header.heightNumber}px;
  width: 100%;

  padding-top: ${(props) =>
    props.$windowWidthSize > MEDIA_MOBILE_MAX_WIDTH_NUM
      ? props.$MapFullMargin
      : 0}px;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    position: relative;
    z-index: 1000;
    top: 0px;
    height: 500px;
    max-width: none;
    background-color: white;
    border-radius: 20px;
    border: 1px solid #cfcfcf;
    padding-bottom: 10px;

    -webkit-animation: scale-in-center 0.3s
      cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    animation: scale-in-center 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  }
`;

const MyProfileImgButtonWrap = styled.div`
  margin: auto 10px auto 0;
  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;
`;

const MyProfileImgButton = styled.img`
  width: ${FilterButtonSize}px;
  height: ${FilterButtonSize}px;
  border-radius: 40px;
  display: flex;
  border: 2px solid white;

  object-fit: cover;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 2px 4px 0px;

  cursor: pointer;
`;

const MapProfileSettingContextWrap = styled.div`
  padding: 5px 8px;
  display: flex;
  flex-flow: column;
  gap: 8px;
`;

const MapProfileSettingTab = styled.div`
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

const MapProfileSettingTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey8};
`;

const MapExplorePopupCloseButtonnWrap = styled.div`
  position: absolute;
  right: 0px;
  height: 60px;
  display: flex;
  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;
`;

const MapExplorePeriosCloseButtonnWrap = styled(
  MapExplorePopupCloseButtonnWrap,
)`
  position: relative;
`;

const MapExplorePopupCloseButtonnSubWrap = styled.div`
  width: ${FilterButtonSize}px;
  height: ${FilterButtonSize}px;
  border-radius: 40px;
  border: 2px solid white;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  margin: auto 10px auto 0;
`;

const MapExplorePeriodFilterCloseButtonSubWrap = styled(
  MapExplorePopupCloseButtonnSubWrap,
)`
  margin: auto 0 auto 10px;
`;

const MapExplorePopupCloseButton = styled.div`
  display: flex;
  margin: auto;
`;

const MapExploreHeaderWrap = styled.div<{ $MapFullMargin: number }>`
  z-index: 200;
  width: 100%;
  position: absolute;
  display: flex;

  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin-top: ${(props) => props.$MapFullMargin}px;
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
  width: 150px;
`;

const SearchContainer = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const SearchAddressWrap = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;

  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const SearchWrap = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const SearchSS = styled.div`
  padding: 0 10px;
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

const MapExplorePeriosFilterButtonnWrap = styled.div`
  position: relative;
  display: flex;
`;
export default MapExploreHeader;
