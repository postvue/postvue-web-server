import { ReactComponent as SearchWordDeleteButtonIcon } from 'assets/images/icon/svg/SearchWordDeleteButtonIcon.svg';
import TabStickBar from 'components/common/container/TabStickBar';
import LocationPositionElement from 'components/location/LocationPostionElement';
import SearchQueryElement from 'components/search/body/SearchQueryElement';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE } from 'const/LocalStorageConst';
import {
  MAP_CONTENT_LOCATION_TYPE,
  MAP_CONTENT_POST_TYPE,
} from 'const/MapExploreConst';
import { SEARCH_POST_PATH } from 'const/PathConst';
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
import { SearchRecentKeywordInterface } from '../../../global/interface/localstorage/SearchInterface';
import {
  deleteRecentlyKeyword,
  getRecentSearchWordList,
  handleSearch,
} from '../../../global/util/SearchUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import theme from '../../../styles/theme';

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

  const [isMapExploreSearchResultActive, setIsMapExploreSearchResultActive] =
    useRecoilState(isMapExploreSearchResultActiveAtom);

  const navigate = useNavigate();

  const [recentSearchWordList, setRecentSearchWordList] = useState<
    SearchRecentKeywordInterface[]
  >([]);

  const mapSearchTempWord = useRecoilValue(mapSearchTempWordAtom);
  const [mapSearchPostWord, setMapSearchPostWord] = useRecoilState(
    mapSearchPostWordAtom,
  );

  const onClickDeleteSearchWord = (searchWord: string) => {
    const deletedSearchRecentSearchWordList: SearchRecentKeywordInterface[] =
      deleteRecentlyKeyword(
        MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
        searchWord,
      );

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
    setRecentSearchWordList(
      getRecentSearchWordList(MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE),
    );

    return () => {
      setRecentSearchWordList([]);
    };
  }, []);

  const {
    data: mapLocalSearchList,
    isFetching: isFetchingByMapLocal,
    isFetched: isFetchedByMapLocal,
  } = QueryStateMapLocalSearchList(
    mapSearchTempWord,
    isMapExploreSearchResultActive &&
      mapExploreSearchTabId === MAP_EXPLORE_SEARCH_LOCATION_TAB_ID,
  );

  const {
    data: mapPostSearchRelation,
    isFetching: isFetchingByMapPost,
    isFetched: isFetchedByMapPost,
  } = QueryStateMapPostSearchRelationInfinite(
    mapSearchTempWord,
    isMapExploreSearchResultActive &&
      mapExploreSearchTabId === MAP_EXPLORE_SEARCH_POST_TAB_ID,
  );

  const {
    data: mapRecommSearchList,
    isFetching: isFetchingByMapRecomm,
    isFetched: isFetchedByMapRecomm,
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
                          <SearchQueryElement
                            searchQueryWord={v.name}
                            onClickSearchQueryItem={() => {
                              navigate(`${SEARCH_POST_PATH}/${v.name}`);
                            }}
                          >
                            <RecentDeleteButtonWrap
                              onClick={() => onClickDeleteSearchWord(v.name)}
                            >
                              <SearchWordDeleteButtonIcon />
                            </RecentDeleteButtonWrap>
                          </SearchQueryElement>
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
                              handleSearch(
                                MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
                                value.roadAddr,
                              );
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
                                handleSearch(
                                  MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
                                  value.searchQueryName,
                                );
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
                            handleSearch(
                              MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
                              value.roadAddr,
                            );
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
                                handleSearch(
                                  MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
                                  value.searchQueryName,
                                );
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
        mapSearchTempWord !== '' && (
          <NotLocatoinPositionWrap>결과가 없습니다.</NotLocatoinPositionWrap>
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
  padding: 20px 0 12px 0;
  color: ${({ theme }) => theme.grey.Grey6};
`;

const SearchRecentWordContainer = styled.div`
  overflow-y: scroll;
  // height: calc(100vh - ${theme.systemSize.header.heightNumber * 2 + 30}px);
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
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 0
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

const NotLocatoinPositionWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
`;

const MapPostSearchQueryWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

export default MapExploreSearchSuggestBody;
