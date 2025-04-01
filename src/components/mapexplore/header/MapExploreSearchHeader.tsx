import React, { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import HeaderLayout from '../../layouts/HeaderLayout';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { MAP_EXPLORE_SELECT_LOCATION_PHARSE_TEXT } from 'const/SystemPhraseConst';
import { MAP_EXPLORE_SEARCH_POST_TAB_ID } from 'const/TabConfigConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import {
  isMapExploreSearchResultActiveAtom,
  isMapSearchInputActiveAtom,
  mapExploreSearchTabIdAtom,
  mapSearchTempWordAtom,
} from 'states/MapExploreAtom';
import MapSearchInputElement from './MapSearchInputElement';

interface MapExploreSearchHeaderProps {
  SearchButtonInputLayoutActiveStyle?: React.CSSProperties;
  SearchButtonInputLayoutNotActiceStyle?: React.CSSProperties;
  address: string;
  onClickMapPostButton: (postSearchQuery: string) => void;
}

const MapExploreSearchHeader: React.FC<MapExploreSearchHeaderProps> = ({
  SearchButtonInputLayoutActiveStyle,
  SearchButtonInputLayoutNotActiceStyle,
  address,
  onClickMapPostButton,
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

  const mapExploreSearchTabId = useRecoilValue(mapExploreSearchTabIdAtom);

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

  const { windowWidth } = useWindowSize();

  return (
    <>
      <HeaderLayout
        HeaderLayoutStyle={{
          ...{
            height: '60px',
            paddingTop: '0px',
            backgroundColor: 'transparent',
            position: 'static',
          },
        }}
      >
        <MapExploreHeaderWrap>
          {/* <SearchContainerWrap>
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
          </SearchContainerWrap> */}
          <SearchContainerWrap>
            <MapSearchInputElement
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
              hasHandlePress={
                mapExploreSearchTabId === MAP_EXPLORE_SEARCH_POST_TAB_ID
              }
              onSearchQueryByPost={() =>
                onClickMapPostButton(mapSearchTempWord)
              }
            />
          </SearchContainerWrap>

          {isMapSearchInputActive &&
            windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
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

  --webkit-animation: scale-up-hor-right 0.4s
    cubic-bezier(0.39, 0.575, 0.565, 1) both;
  // animation: scale-up-hor-right 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;
`;

export default MapExploreSearchHeader;
