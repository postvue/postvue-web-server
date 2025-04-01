import { ReactComponent as SearchWordDeleteButtonIcon } from 'assets/images/icon/svg/SearchWordDeleteButtonIcon.svg';
import LoadingComponent from 'components/common/container/LoadingComponent';
import TabStickBar from 'components/common/container/TabStickBar';
import LocationPositionElement from 'components/location/LocationPostionElement';
import SearchQueryElement from 'components/search/body/SearchQueryElement';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { MAP_SEARCH_LOCATION_TYPE } from 'const/SearchConst';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import {
  MAP_EXPLORE_SEARCH_LOCATION_TAB_ID,
  MAP_EXPLORE_SEARCH_LOCATION_TAB_NAME,
  MAP_EXPLORE_SEARCH_POST_TAB_ID,
  MAP_EXPLORE_SEARCH_POST_TAB_NAME,
  MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
  MAP_EXPLORE_SEARCH_TASTE_TAB_NAME,
} from 'const/TabConfigConst';
import { MapLocalSrchRsp } from 'global/interface/map';
import {
  deleteMapRecentlyKeyword,
  getMapRecentSearchWordList,
} from 'global/util/MapSearchUtil';

import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isMapExploreSearchResultActiveAtom,
  isMapSearchInputActiveAtom,
  mapExploreSearchTabIdAtom,
  mapMoveLocationAtom,
  mapSearchTempWordAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import { MapSearchRecentKeywordInterface } from '../../../global/interface/localstorage/SearchInterface';
import { isValidString } from '../../../global/util/ValidUtil';
import MapExploreSearchLocationSuggestBody from './MapExploreSearchLocationSuggestBody';
import MapExploreSearchPostSuggestBody from './MapExploreSearchPostSuggestBody';
import MapExploreSearchRecommSuggestBody from './MapExploreSearchRecommSuggestBody';

interface MapExploreSearchSuggestBodyProps {
  SearchSuggestBodyContiainerStyle?: React.CSSProperties;
  onClickMapPostButton: (postSearchQuery: string) => void;
  onClickAddress: (value: MapLocalSrchRsp) => void;
}

const MapExploreSearchSuggestBody: React.FC<
  MapExploreSearchSuggestBodyProps
> = ({
  SearchSuggestBodyContiainerStyle,
  onClickMapPostButton,
  onClickAddress,
}) => {
  const mapExploreSearchTabList = [
    {
      tabId: MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
      tabName: MAP_EXPLORE_SEARCH_TASTE_TAB_NAME,
    },
    {
      tabId: MAP_EXPLORE_SEARCH_POST_TAB_ID,
      tabName: MAP_EXPLORE_SEARCH_POST_TAB_NAME,
    },
    {
      tabId: MAP_EXPLORE_SEARCH_LOCATION_TAB_ID,
      tabName: MAP_EXPLORE_SEARCH_LOCATION_TAB_NAME,
    },
  ];
  // const setMapContentType = useSetRecoilState(mapContentTypeAtom);
  const [mapExploreSearchTabId, setMapExploreSearchTabId] = useRecoilState(
    mapExploreSearchTabIdAtom,
  );
  const setIsMapSearchInputActive = useSetRecoilState(
    isMapSearchInputActiveAtom,
  );

  const isMapExploreSearchResultActive = useRecoilValue(
    isMapExploreSearchResultActiveAtom,
  );

  const [recentSearchWordList, setRecentSearchWordList] = useState<
    MapSearchRecentKeywordInterface[]
  >([]);

  const [mapSearchTempWord, setMapSearchTempWord] = useRecoilState(
    mapSearchTempWordAtom,
  );

  const onClickDeleteSearchWord = (
    searchWord: MapSearchRecentKeywordInterface,
  ) => {
    const deletedSearchRecentSearchWordList: MapSearchRecentKeywordInterface[] =
      deleteMapRecentlyKeyword(searchWord);

    setRecentSearchWordList(deletedSearchRecentSearchWordList);
  };

  // const setMapLoaction = useSetRecoilState(mapLoactionAtom);

  // const setMapExploreFilterTab = useSetRecoilState(mapExploreFilterTabAtom);

  const [mapMoveLocation, setMapMoveLoation] =
    useRecoilState(mapMoveLocationAtom);

  // QueryStateMapExploreList(
  //   mapLoaction.latitude,
  //   mapLoaction.longitude,
  //   mapExploreFilterTab,
  //   mapDatePickerPopupInfo.dateInfo.startDate
  //     ? mapDatePickerPopupInfo.dateInfo.startDate.toISOString()
  //     : null,
  //   mapDatePickerPopupInfo.dateInfo.endDate
  //     ? mapDatePickerPopupInfo.dateInfo.endDate.toISOString()
  //     : null,
  //   isQuery && mapContentType === MAP_CONTENT_LOCATION_TYPE,
  // );
  // QueryStatePostMapPostInfinite(
  //   mapSearchPostWord,
  //   isMapPostQuery && mapContentType === MAP_CONTENT_POST_TYPE,
  // );

  // const onClickGeoPositionRefreshButton = (
  //   latitude: number,
  //   longitude: number,
  // ) => {
  //   setMapExploreFilterTab(MAP_EXPLORE_ALL_TAB_PARAM);
  //   setMapLoaction({
  //     latitude: latitude,
  //     longitude: longitude,
  //     isMoveCenter: true,
  //   });
  //   setMapContentType(MAP_CONTENT_LOCATION_TYPE);
  // };

  // const onClickMapPostButton = (postSearchQuery: string) => {
  //   setIsMapSearchInputActive(false);
  //   setMapExploreFilterTab(MAP_EXPLORE_ALL_TAB_PARAM);
  //   setMapSearchPostWord(postSearchQuery);
  //   setCurrentSearchQuery(postSearchQuery);
  //   setMapContentType(MAP_CONTENT_POST_TYPE);
  //   setMapLoaction({
  //     latitude: mapMoveLocation.latitude,
  //     longitude: mapMoveLocation.longitude,
  //     isMoveCenter: false,
  //   });
  //   setMapSearchTempWord('');
  // };

  useEffect(() => {
    setRecentSearchWordList(getMapRecentSearchWordList());

    return () => {
      setRecentSearchWordList([]);
    };
  }, []);

  // const setCurrentSearchQuery = useSetRecoilState(currentSearchQueryAtom);

  const { windowWidth } = useWindowSize();
  return (
    <>
      <SearchSuggestBodyContainer style={SearchSuggestBodyContiainerStyle}>
        <SearchFilterTabContainer>
          <SearchFilterTabWrap>
            {mapExploreSearchTabList.map((v, i) => (
              <TabItem
                key={i}
                className={
                  mapExploreSearchTabId === v.tabId ? ACTIVE_CLASS_NAME : ''
                }
                onClick={() => {
                  // if (v.tabId === MAP_EXPLORE_SERACH_TASTE_TAB_ID) {
                  //   setCurrentIntertestByUserSettingInfo(
                  //     POPULARITY_STATE_SESSION_VALUE,
                  //   );
                  // } else if (v.tabId === MAP_EXPLORE_SEARCH_POST_TAB_ID) {
                  // } else {
                  //   setScrollPositionByTaste(window.scrollY);

                  //   setCurrentIntertestByUserSettingInfo(
                  //     FOLLOW_STATE_SESSION_VALUE,
                  //   );
                  //   setTimeout(() => {
                  //     window.scrollTo({ top: scrollPositionByFollow });
                  //   }, 0);
                  // }
                  // saveMainTabIdByHomeHistory(v.tabId);
                  setMapExploreSearchTabId(v.tabId);
                }}
              >
                {v.tabName}
                {mapExploreSearchTabId === v.tabId && <TabStickBar />}
              </TabItem>
            ))}
          </SearchFilterTabWrap>
          {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM && (
            <SearchFilterClose
              onClick={() => {
                setIsMapSearchInputActive(false);
              }}
            >
              닫기
            </SearchFilterClose>
          )}
        </SearchFilterTabContainer>
        <SearchRecentWordContainer>
          {!isValidString(mapSearchTempWord) ? (
            <>
              {recentSearchWordList.length > 0 ? (
                <>
                  <SearchRelatedTitle>최근 검색어</SearchRelatedTitle>
                  <SearchWordContainer>
                    {recentSearchWordList &&
                      recentSearchWordList
                        .slice(0)
                        .reverse()
                        .map((v, i) => (
                          <React.Fragment key={i}>
                            {v.searchWordType === MAP_SEARCH_LOCATION_TYPE ? (
                              <>
                                {(mapExploreSearchTabId ===
                                  MAP_EXPLORE_SEARCH_RECOMM_TAB_ID ||
                                  mapExploreSearchTabId ===
                                    MAP_EXPLORE_SEARCH_LOCATION_TAB_ID) && (
                                  <LocationPositionElementWrap>
                                    <LocationPositionElement
                                      buildName={v.name}
                                      roadAddr={v.roadAddr}
                                      onClickAddress={() => {
                                        onClickAddress({
                                          roadAddr: v.roadAddr,
                                          hasLocation: v.isLocation,
                                          placeName: v.name,
                                          latitude: v.latitude,
                                          longitude: v.longitude,
                                        });
                                      }}
                                    />
                                    <RecentDeleteButtonWrap
                                      onClick={() => onClickDeleteSearchWord(v)}
                                    >
                                      <SearchWordDeleteButtonIcon />
                                    </RecentDeleteButtonWrap>
                                  </LocationPositionElementWrap>
                                )}
                              </>
                            ) : (
                              <>
                                {(mapExploreSearchTabId ===
                                  MAP_EXPLORE_SEARCH_RECOMM_TAB_ID ||
                                  mapExploreSearchTabId ===
                                    MAP_EXPLORE_SEARCH_POST_TAB_ID) && (
                                  <SearchQueryElement
                                    searchQueryWord={v.name}
                                    onClickSearchQueryItem={() => {
                                      onClickMapPostButton(v.name);
                                    }}
                                    key={i}
                                  >
                                    <RecentDeleteButtonWrap
                                      onClick={() => onClickDeleteSearchWord(v)}
                                    >
                                      <SearchWordDeleteButtonIcon />
                                    </RecentDeleteButtonWrap>
                                  </SearchQueryElement>
                                )}
                              </>
                            )}
                          </React.Fragment>
                        ))}
                  </SearchWordContainer>
                </>
              ) : (
                <SearchBaseTitle>생각나는 장소를 검색해보세요.</SearchBaseTitle>
              )}
            </>
          ) : (
            <>
              {mapExploreSearchTabId === MAP_EXPLORE_SEARCH_RECOMM_TAB_ID && (
                <MapExploreSearchRecommSuggestBody
                  mapSearchWord={mapSearchTempWord}
                  mapMoveLocation={mapMoveLocation}
                  onClickAddressButton={onClickAddress}
                  onClickMapPostButton={onClickMapPostButton}
                />
              )}
              {mapExploreSearchTabId === MAP_EXPLORE_SEARCH_LOCATION_TAB_ID && (
                <MapExploreSearchLocationSuggestBody
                  mapSearchWord={mapSearchTempWord}
                  mapMoveLocation={mapMoveLocation}
                  onClickAddressButton={onClickAddress}
                />
              )}
              {mapExploreSearchTabId === MAP_EXPLORE_SEARCH_POST_TAB_ID && (
                <MapExploreSearchPostSuggestBody
                  mapSearchWord={mapSearchTempWord}
                  mapMoveLocation={mapMoveLocation}
                  onClickMapPostButton={onClickMapPostButton}
                />
              )}
            </>
          )}
        </SearchRecentWordContainer>

        {mapSearchTempWord !== '' && !isMapExploreSearchResultActive && (
          <LoadingComponent />
        )}
      </SearchSuggestBodyContainer>
    </>
  );
};

const SearchSuggestBodyContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.mainColor.White};
  z-index: 500;
  display: flex;
  flex-flow: column;
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  padding: 0px 0 12px 0;
  color: ${({ theme }) => theme.grey.Grey6};
`;

const SearchRecentWordContainer = styled.div`
  overflow-y: scroll;
  height: calc(
    100dvh -
      ${(parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--safe-area-inset-bottom',
        ),
      ) || 0) +
      (parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--safe-area-inset-top',
        ),
      ) || 0) +
      theme.systemSize.header.heightNumber +
      60 +
      theme.systemSize.bottomNavBar.heightNum}px
  );
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: 100%;
    flex: 1;
  }
`;

const SearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

const RecentDeleteButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

const SearchFilterTabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 15px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SearchFilterTabWrap = styled.div`
  display: flex;
  gap: 20px;
  // position: fixed;
  // z-index: 1;
  // left: 50%;
  // transform: translate(-50%, 50%);
`;

const SearchFilterClose = styled.div`
  cursor: pointer;
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const TabItem = styled.div`
  color: ${({ theme }) => theme.grey.Grey4};
  cursor: pointer;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    font: ${({ theme }) => theme.fontSizes.Subhead3};
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    font: ${({ theme }) => theme.fontSizes.Headline1};
  }

  &.active {
    color: black;
  }
`;

const LocationPositionElementWrap = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const SearchBaseTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

export default MapExploreSearchSuggestBody;
