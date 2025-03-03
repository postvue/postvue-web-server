import NoResultComponent from 'components/common/container/NoResultComponent';
import SearchQueryElement from 'components/search/body/SearchQueryElement';
import { MAP_SEARCH_POST_TYPE } from 'const/SearchConst';
import { handleMapSearch } from 'global/util/MapSearchUtil';
import { isValidString } from 'global/util/ValidUtil';

import useAppleMapSearchWithCache from 'hook/customhook/useAppleMapSearchWithCache';
import { QueryStateMapPostSearchRelationInfinite } from 'hook/queryhook/QueryStateMapPostSearchRelationInfinite';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  isMapExploreSearchResultActiveAtom,
  MapMoveLocationType,
} from 'states/MapExploreAtom';
import styled from 'styled-components';

interface MapExploreSearchSuggestBodyProps {
  onClickMapPostButton: (postSearchQuery: string) => void;
  mapSearchWord: string;
  mapMoveLocation: MapMoveLocationType;
}

const MapExploreSearchPostSuggestBody: React.FC<
  MapExploreSearchSuggestBodyProps
> = ({ onClickMapPostButton, mapSearchWord, mapMoveLocation }) => {
  const isMapExploreSearchResultActive = useRecoilValue(
    isMapExploreSearchResultActiveAtom,
  );

  const {
    data: mapPostSearchRelation,
    isFetching: isFetchingByMapPost,
    isFetched: isFetchedByMapPost,
  } = QueryStateMapPostSearchRelationInfinite(
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
      <SearchWordContainer>
        {mapPostSearchRelation &&
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
              {(!mapPostSearchRelation ||
                mapPostSearchRelation.pages.flatMap((v) => v).length <= 0) &&
                isFetchedByMapPost &&
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

export default MapExploreSearchPostSuggestBody;
