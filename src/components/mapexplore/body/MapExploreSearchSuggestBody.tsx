import { ReactComponent as SearchWordDeleteButtonIcon } from 'assets/images/icon/svg/SearchWordDeleteButtonIcon.svg';
import LoadingComponent from 'components/common/container/LoadingComponent';
import NoResultComponent from 'components/common/container/NoResultComponent';
import TabStickBar from 'components/common/container/TabStickBar';
import LocationPositionElement from 'components/location/LocationPostionElement';
import SearchQueryElement from 'components/search/body/SearchQueryElement';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import {
  MAP_CONTENT_LOCATION_TYPE,
  MAP_CONTENT_POST_TYPE,
} from 'const/MapExploreConst';
import {
  MAP_SEARCH_LOCATION_TYPE,
  MAP_SEARCH_POST_TYPE,
} from 'const/SearchConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import {
  MAP_EXPLORE_ALL_TAB_PARAM,
  MAP_EXPLORE_SEARCH_LOCATION_TAB_ID,
  MAP_EXPLORE_SEARCH_LOCATION_TAB_NAME,
  MAP_EXPLORE_SEARCH_POST_TAB_ID,
  MAP_EXPLORE_SEARCH_POST_TAB_NAME,
  MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
  MAP_EXPLORE_SEARCH_TASTE_TAB_NAME,
} from 'const/TabConfigConst';
import { MapLocalSrchRsp } from 'global/interface/map';
import { GeoPositionInterface } from 'global/util/MapExploreUtil';
import {
  deleteMapRecentlyKeyword,
  getMapRecentSearchWordList,
  handleMapSearch,
} from 'global/util/MapSearchUtil';
import { QueryStateMapExploreList } from 'hook/queryhook/QueryStateMapExploreList';
import { QueryStateMapLocalSearchList } from 'hook/queryhook/QueryStateMapLocalSearchList';
import { QueryStateMapPostSearchRelationInfinite } from 'hook/queryhook/QueryStateMapPostSearchRelationInfinite';
import { QueryStateMapRecommSearchList } from 'hook/queryhook/QueryStateMapRecommSearchList';
import { QueryStatePostMapPostInfinite } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMapLocation } from 'services/maps/getMapLocation';
import {
  isMapExploreSearchResultActiveAtom,
  isMapSearchInputActiveAtom,
  mapContentTypeAtom,
  mapExploreFilterTabAtom,
  mapExploreSearchTabIdAtom,
  mapLoactionAtom,
  mapSearchPostWordAtom,
  mapSearchTempWordAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';
import { MapSearchRecentKeywordInterface } from '../../../global/interface/localstorage/SearchInterface';
import { isValidString } from '../../../global/util/ValidUtil';

interface MapExploreSearchSuggestBodyProps {
  SearchSuggestBodyContiainerStyle?: React.CSSProperties;
  onChangeNaverMap: (mapLocation: GeoPositionInterface) => void;
}

const MapExploreSearchSuggestBody: React.FC<
  MapExploreSearchSuggestBodyProps
> = ({ SearchSuggestBodyContiainerStyle, onChangeNaverMap }) => {
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
  const [mapContentType, setMapContentType] =
    useRecoilState(mapContentTypeAtom);
  const [mapExploreSearchTabId, setMapExploreSearchTabId] = useRecoilState(
    mapExploreSearchTabIdAtom,
  );
  const setIsMapSearchInputActive = useSetRecoilState(
    isMapSearchInputActiveAtom,
  );

  const isMapExploreSearchResultActive = useRecoilValue(
    isMapExploreSearchResultActiveAtom,
  );

  const navigate = useNavigate();

  const [recentSearchWordList, setRecentSearchWordList] = useState<
    MapSearchRecentKeywordInterface[]
  >([]);

  const mapSearchTempWord = useRecoilValue(mapSearchTempWordAtom);
  const [mapSearchPostWord, setMapSearchPostWord] = useRecoilState(
    mapSearchPostWordAtom,
  );

  const onClickDeleteSearchWord = (
    searchWord: MapSearchRecentKeywordInterface,
  ) => {
    const deletedSearchRecentSearchWordList: MapSearchRecentKeywordInterface[] =
      deleteMapRecentlyKeyword(searchWord);

    setRecentSearchWordList(deletedSearchRecentSearchWordList);
  };

  const [isQuery, setIsQuery] = useState<boolean>(true);
  const [isMapPostQuery, setIsMapPostQuery] = useState<boolean>(true);
  const [mapLoaction, setMapLoaction] = useRecoilState(mapLoactionAtom);
  const [mapExploreFilterTab, setMapExploreFilterTab] = useRecoilState(
    mapExploreFilterTabAtom,
  );

  const { data: mapExplorePostList } = QueryStateMapExploreList(
    mapLoaction.latitude,
    mapLoaction.longitude,
    mapExploreFilterTab,
    isQuery && mapContentType === MAP_CONTENT_LOCATION_TYPE,
  );

  const { data: postMapPostList } = QueryStatePostMapPostInfinite(
    mapSearchPostWord,
    isMapPostQuery && mapContentType === MAP_CONTENT_POST_TYPE,
  );

  const onClickGeoPositionRefreshButton = (
    latitude: number,
    longitude: number,
  ) => {
    setIsQuery(false);
    setMapExploreFilterTab(MAP_EXPLORE_ALL_TAB_PARAM);
    setMapLoaction({
      latitude: latitude,
      longitude: longitude,
    });
    setMapContentType(MAP_CONTENT_LOCATION_TYPE);
    setIsQuery(true);
  };

  const onClickMapPostButton = (postSearchQuery: string) => {
    setIsMapSearchInputActive(false);
    setIsMapPostQuery(false);
    setMapExploreFilterTab(MAP_EXPLORE_ALL_TAB_PARAM);
    setMapSearchPostWord(postSearchQuery);
    setMapContentType(MAP_CONTENT_POST_TYPE);
    setIsMapPostQuery(true);
  };

  useEffect(() => {
    setRecentSearchWordList(getMapRecentSearchWordList());

    return () => {
      setRecentSearchWordList([]);
    };
  }, []);

  const {
    data: mapLocalSearchList,
    isFetching: isFetchingByMapLocal,
    isFetched: isFetchedByMapLocal,
    isLoading: isLoadingByMapLocal,
  } = QueryStateMapLocalSearchList(
    mapSearchTempWord,
    isMapExploreSearchResultActive &&
      mapExploreSearchTabId === MAP_EXPLORE_SEARCH_LOCATION_TAB_ID,
  );

  const {
    data: mapPostSearchRelation,
    isFetching: isFetchingByMapPost,
    isFetched: isFetchedByMapPost,
    isLoading: isLoadingByMapPost,
  } = QueryStateMapPostSearchRelationInfinite(
    mapSearchTempWord,
    isMapExploreSearchResultActive &&
      mapExploreSearchTabId === MAP_EXPLORE_SEARCH_POST_TAB_ID,
  );

  const {
    data: mapRecommSearchList,
    isFetching: isFetchingByMapRecomm,
    isFetched: isFetchedByMapRecomm,
    isLoading: isLoadingByMapRecomm,
  } = QueryStateMapRecommSearchList(
    mapSearchTempWord,
    isMapExploreSearchResultActive &&
      mapExploreSearchTabId === MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
  );

  const onClickAddress = (value: MapLocalSrchRsp) => {
    if (value.hasLocation) {
      onChangeNaverMap({
        latitude: value.latitude,
        longitude: value.longitude,
      });
      setIsMapSearchInputActive(false);
      onClickGeoPositionRefreshButton(value.latitude, value.longitude);
    } else {
      getMapLocation(value.roadAddr).then((mapLocationRsp) => {
        onChangeNaverMap({
          latitude: mapLocationRsp.latitude,
          longitude: mapLocationRsp.longitude,
        });
        setIsMapSearchInputActive(false);
        onClickGeoPositionRefreshButton(
          mapLocationRsp.latitude,
          mapLocationRsp.longitude,
        );
      });
    }
  };

  return (
    <SearchSuggestBodyContainer style={SearchSuggestBodyContiainerStyle}>
      <SearchFilterTabContainer>
        <SearchFilterTabWrap>
          {mapExploreSearchTabList.map((v, i) => (
            <>
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
            </>
          ))}
        </SearchFilterTabWrap>
      </SearchFilterTabContainer>
      <SearchRecentWordContainer>
        {!isValidString(mapSearchTempWord) ? (
          <>
            {recentSearchWordList.length > 0 && (
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
            )}
          </>
        ) : (
          <>
            <SearchWordContainer>
              {mapExploreSearchTabId === MAP_EXPLORE_SEARCH_RECOMM_TAB_ID &&
                mapRecommSearchList &&
                isMapExploreSearchResultActive &&
                !isFetchingByMapRecomm && (
                  <>
                    {mapRecommSearchList.map((value, key) => {
                      if (value.isPlace) {
                        return (
                          <LocationPositionElement
                            key={key}
                            buildName={value.placeName}
                            roadAddr={value.roadAddr}
                            onClickAddress={() => {
                              handleMapSearch({
                                name: value.placeName,
                                roadAddr: value.roadAddr,
                                isExposed: true,
                                isLocation: value.isPlace,
                                searchWordType: MAP_SEARCH_LOCATION_TYPE,
                                latitude: value.latitude,
                                longitude: value.longitude,
                              });
                              onClickAddress(value);
                            }}
                          />
                        );
                      } else {
                        return (
                          <MapPostSearchQueryWrap key={key}>
                            <SearchQueryElement
                              searchQueryWord={value.searchQueryName}
                              onClickSearchQueryItem={() => {
                                handleMapSearch({
                                  name: value.searchQueryName,
                                  roadAddr: '',
                                  isExposed: true,
                                  isLocation: false,
                                  searchWordType: MAP_SEARCH_POST_TYPE,
                                  latitude: 0,
                                  longitude: 0,
                                });
                                onClickMapPostButton(value.searchQueryName);
                              }}
                            />
                          </MapPostSearchQueryWrap>
                        );
                      }
                    })}
                  </>
                )}
              {mapExploreSearchTabId === MAP_EXPLORE_SEARCH_LOCATION_TAB_ID &&
                mapLocalSearchList &&
                isMapExploreSearchResultActive &&
                !isFetchingByMapLocal && (
                  <>
                    {mapLocalSearchList.map((value, key) => {
                      return (
                        <LocationPositionElement
                          key={key}
                          buildName={value.placeName}
                          roadAddr={value.roadAddr}
                          onClickAddress={() => {
                            handleMapSearch({
                              name: value.placeName,
                              roadAddr: value.roadAddr,
                              isExposed: true,
                              isLocation: value.hasLocation,
                              searchWordType: MAP_SEARCH_LOCATION_TYPE,
                              latitude: value.latitude,
                              longitude: value.longitude,
                            });
                            onClickAddress(value);
                          }}
                        />
                      );
                    })}
                  </>
                )}
              {mapExploreSearchTabId === MAP_EXPLORE_SEARCH_POST_TAB_ID &&
                mapPostSearchRelation &&
                isMapExploreSearchResultActive &&
                !isFetchingByMapPost && (
                  <>
                    {mapPostSearchRelation.pages.flatMap((v) =>
                      v.map((value, key) => {
                        return (
                          <MapPostSearchQueryWrap key={key}>
                            <SearchQueryElement
                              searchQueryWord={value.searchQueryName}
                              onClickSearchQueryItem={() => {
                                handleMapSearch({
                                  name: value.searchQueryName,
                                  roadAddr: '',
                                  isExposed: true,
                                  isLocation: false,
                                  searchWordType: MAP_SEARCH_POST_TYPE,
                                  latitude: 0,
                                  longitude: 0,
                                });
                                onClickMapPostButton(value.searchQueryName);
                              }}
                            />
                          </MapPostSearchQueryWrap>
                        );
                      }),
                    )}
                  </>
                )}
            </SearchWordContainer>
          </>
        )}
      </SearchRecentWordContainer>
      {(((!mapRecommSearchList || mapRecommSearchList.length <= 0) &&
        mapExploreSearchTabId === MAP_EXPLORE_SEARCH_RECOMM_TAB_ID &&
        isFetchedByMapRecomm) ||
        ((!mapLocalSearchList || mapLocalSearchList.length <= 0) &&
          mapExploreSearchTabId === MAP_EXPLORE_SEARCH_LOCATION_TAB_ID &&
          isFetchedByMapLocal) ||
        ((!mapPostSearchRelation ||
          mapPostSearchRelation.pages.flatMap((v) => v).length <= 0) &&
          mapExploreSearchTabId === MAP_EXPLORE_SEARCH_POST_TAB_ID &&
          isFetchedByMapPost)) &&
        isMapExploreSearchResultActive &&
        mapSearchTempWord !== '' && <NoResultComponent />}
      {mapSearchTempWord !== '' && !isMapExploreSearchResultActive && (
        <LoadingComponent />
      )}
    </SearchSuggestBodyContainer>
  );
};

const SearchSuggestBodyContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.mainColor.White};
  z-index: 500;
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  padding: 0px 0 12px 0;
  color: ${({ theme }) => theme.grey.Grey6};
`;

const SearchRecentWordContainer = styled.div`
  overflow-y: scroll;
  height: calc(100% - 60px);
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 18px;
`;

const RecentDeleteButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

const SearchFilterTabContainer = styled.div`
  // justify-content: center;
  // display: flex;

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

const MapPostSearchQueryWrap = styled.div``;

const LocationPositionElementWrap = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

export default MapExploreSearchSuggestBody;
