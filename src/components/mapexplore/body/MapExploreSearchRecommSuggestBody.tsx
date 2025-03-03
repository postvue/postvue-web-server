import NoResultComponent from 'components/common/container/NoResultComponent';
import LocationPositionElement from 'components/location/LocationPostionElement';
import SearchQueryElement from 'components/search/body/SearchQueryElement';
import {
  MAP_SEARCH_LOCATION_TYPE,
  MAP_SEARCH_POST_TYPE,
} from 'const/SearchConst';
import { MapLocalSrchRsp } from 'global/interface/map';
import { handleMapSearch } from 'global/util/MapSearchUtil';
import { isValidString } from 'global/util/ValidUtil';

import useAppleMapSearchWithCache from 'hook/customhook/useAppleMapSearchWithCache';
import { QueryStateMapRecommSearchList } from 'hook/queryhook/QueryStateMapRecommSearchList';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  isMapExploreSearchResultActiveAtom,
  MapMoveLocationType,
} from 'states/MapExploreAtom';
import styled from 'styled-components';

interface MapExploreSearchSuggestBodyProps {
  onClickAddressButton: (value: MapLocalSrchRsp) => void;
  onClickMapPostButton: (postSearchQuery: string) => void;
  mapSearchWord: string;
  mapMoveLocation: MapMoveLocationType;
}

const MapExploreSearchRecommSuggestBody: React.FC<
  MapExploreSearchSuggestBodyProps
> = ({
  onClickAddressButton,
  onClickMapPostButton,
  mapSearchWord,
  mapMoveLocation,
}) => {
  const isMapExploreSearchResultActive = useRecoilValue(
    isMapExploreSearchResultActiveAtom,
  );

  const { data: mapRecommSearchList, isFetched: isFetchedByMapRecomm } =
    QueryStateMapRecommSearchList(
      mapSearchWord,
      isMapExploreSearchResultActive,
    );

  const [isActiveMapApple, setIsActiveMapApple] = useState<boolean>(false);

  const {
    mapAppleSearchList,
    isFetched: isFetchedByMapAppleSearchList,
    isVisible: isVisibleByMapAppleSearch,
  } = useAppleMapSearchWithCache({
    mapSearchWord: mapSearchWord,
    geoPos: {
      latitude: mapMoveLocation.latitude,
      longitude: mapMoveLocation.longitude,
    },
    regionInfo: mapMoveLocation.regionInfo,
    isActive: isActiveMapApple,
    onDeactive: () => {
      setIsActiveMapApple(false);
    },
  });

  return (
    <>
      {isFetchedByMapRecomm && (
        <SearchWordContainer>
          {isValidString(mapSearchWord) && !isVisibleByMapAppleSearch && (
            <SearchOverseasButtonWrap>
              <SearchOverseasButton
                onClick={() => {
                  setIsActiveMapApple(true);
                }}
              >
                해외 검색하기
              </SearchOverseasButton>
            </SearchOverseasButtonWrap>
          )}
          {isVisibleByMapAppleSearch ? (
            <>
              {isFetchedByMapAppleSearchList &&
                mapAppleSearchList &&
                mapAppleSearchList.map((value, key) => {
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
                        onClickAddressButton(value);
                      }}
                    />
                  );
                })}
            </>
          ) : (
            <>
              {mapRecommSearchList && isMapExploreSearchResultActive && (
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
                            onClickAddressButton(value);
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
            </>
          )}
        </SearchWordContainer>
      )}

      {isMapExploreSearchResultActive && (
        <>
          {isVisibleByMapAppleSearch ? (
            <>
              {isFetchedByMapAppleSearchList &&
                mapAppleSearchList &&
                mapAppleSearchList.length <= 0 && <NoResultComponent />}
            </>
          ) : (
            <>
              {(!mapRecommSearchList || mapRecommSearchList.length <= 0) &&
                isFetchedByMapRecomm &&
                isMapExploreSearchResultActive &&
                isValidString(mapSearchWord) && <NoResultComponent />}
            </>
          )}
        </>
      )}
    </>
  );
};

const SearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 18px;
`;

const MapPostSearchQueryWrap = styled.div``;

const SearchOverseasButtonWrap = styled.div`
  display: flex;
  padding-top: 5px;
`;

const SearchOverseasButton = styled.div`
  display: flex;
  margin: 0 auto;
  border-radius: 22px;
  padding: 8px 13px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  font: ${({ theme }) => theme.fontSizes.Body1};
`;
export default MapExploreSearchRecommSuggestBody;
