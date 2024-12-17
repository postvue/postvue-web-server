import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import HeaderLayout from '../../layouts/HeaderLayout';

import SearchInputTemplate from 'components/common/input/SearchInputTemplate';
import { MAP_EXPLORE_SELECT_LOCATION_PHARSE_TEXT } from 'const/SystemPhraseConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import {
  isMapExploreSearchResultActiveAtom,
  isMapSearchInputActiveAtom,
  mapSearchTempWordAtom,
} from 'states/MapExploreAtom';

interface MapExploreSearchHeaderProps {
  MapExploreHeaderActiveContainer?: React.CSSProperties;
  MapExploreHeaderNotActiveContainer?: React.CSSProperties;
  SearchButtonInputLayoutActiveStyle?: React.CSSProperties;
  SearchButtonInputLayoutNotActiceStyle?: React.CSSProperties;
  address: string;
}

const MapExploreSearchHeader: React.FC<MapExploreSearchHeaderProps> = ({
  MapExploreHeaderActiveContainer,
  MapExploreHeaderNotActiveContainer,
  SearchButtonInputLayoutActiveStyle,
  SearchButtonInputLayoutNotActiceStyle,
  address,
}) => {
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [mapSearchTempWord, setMapSearchTempWord] = useRecoilState(
    mapSearchTempWordAtom,
  );

  // 검색 입력 focus 관련 상태 관리
  const [isMapSearchInputActive, setIsMapSearchInputActive] = useRecoilState(
    isMapSearchInputActiveAtom,
  );

  const [isMapExploreSearchResultActive, setIsMapExploreSearchResultActive] =
    useRecoilState(isMapExploreSearchResultActiveAtom);

  const onClickCancelSearchInput = () => {
    setIsMapSearchInputActive(false);
    setMapSearchTempWord('');
  };

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    () => {
      setIsMapExploreSearchResultActive(true);
    },
    [],
    1500,
  );

  useEffect(() => {
    setIsMapExploreSearchResultActive(false);
  }, [mapSearchTempWord]);

  useEffect(() => {
    return () => {
      setIsMapSearchInputActive(false);
    };
  }, []);

  return (
    <>
      <HeaderLayout
        HeaderLayoutStyle={
          isMapSearchInputActive
            ? MapExploreHeaderActiveContainer
            : MapExploreHeaderNotActiveContainer
        }
      >
        <MapExploreHeaderWrap>
          <SearchContainerWrap>
            <SearchInputTemplate
              searchInputRef={searchInputRef}
              deleteButtonRef={deleteButtonRef}
              placeholder={
                isMapSearchInputActive
                  ? MAP_EXPLORE_SELECT_LOCATION_PHARSE_TEXT
                  : address
              }
              searchTempWord={mapSearchTempWord}
              setSearchTempWord={setMapSearchTempWord}
              isSearchInputActive={isMapSearchInputActive}
              setIsSearchInputActive={setIsMapSearchInputActive}
              debouncedGetSearchQuery={debouncedGetSearchQuery}
              SearchButtonInputLayoutStyle={
                isMapSearchInputActive
                  ? SearchButtonInputLayoutActiveStyle
                  : SearchButtonInputLayoutNotActiceStyle
              }
              hasHandlePress={false}
            />
          </SearchContainerWrap>

          {isMapSearchInputActive && (
            <SearchInputCancelButton onClick={onClickCancelSearchInput}>
              취소
            </SearchInputCancelButton>
          )}
        </MapExploreHeaderWrap>
      </HeaderLayout>
      {/* {mapSearchTempWord !== '' &&
        loading &&
        !isMapExploreSearchResultActive && (
          <LoadingComponent LoadingComponentStyle={{ position: 'fixed' }} />
        )} */}
    </>
  );
};

const MapExploreHeaderWrap = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const SearchContainerWrap = styled.div`
  padding: 0 10px;
  display: flex;
  width: 100%;
`;

const SearchInputCancelButton = styled.div`
  margin: auto 0px;
  white-space: nowrap;
  padding-right: 20px;
  cursor: pointer;
`;

export default MapExploreSearchHeader;
