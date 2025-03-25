import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import HeaderLayout from '../../layouts/HeaderLayout';

import LoadingComponent from 'components/common/container/LoadingComponent';
import { LOCATION_SEARCH_INPUT_PHARSE_TEXT } from 'const/SystemPhraseConst';
import { getUnifiedPosition } from 'global/util/PositionUtil';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStateMapAddressRelationInfinite } from 'hook/queryhook/QueryStateMapAddressRelationInfinite';
import {
  currentGisInfoAtom,
  isLocationSearchInputActiveAtom,
  locationSearchWordAtom,
} from 'states/GeoLocationAtom';
import { isMapSLocationLoadingAtom } from 'states/MapExploreAtom';
import theme from 'styles/theme';
import SearchInputTemplate from '../../common/input/SearchInputTemplate';

interface LocationSearchHeaderProps {
  LocationHeaderContainer?: React.CSSProperties;
}

const LocationSearchHeader: React.FC<LocationSearchHeaderProps> = ({
  LocationHeaderContainer,
}) => {
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useRecoilState(isMapSLocationLoadingAtom);

  const [locationSearchTempWord, setLocationSearchTempWord] =
    useState<string>('');

  const [locationSearchWord, setLocationSearchWord] = useRecoilState(
    locationSearchWordAtom,
  );

  // 검색 입력 focus 관련 상태 관리
  const [isLocationSearchInputActive, setIsLocationSearchInputActive] =
    useRecoilState(isLocationSearchInputActiveAtom);

  const [currentGisInfo, setCurrentGisInfo] =
    useRecoilState(currentGisInfoAtom);
  const { data } = QueryStateMapAddressRelationInfinite(
    locationSearchWord,
    currentGisInfo.latitude,
    currentGisInfo.longitude,
  );

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      if (!isValidString(word)) return;
      setLoading(true);
      setLocationSearchWord(word);
      setLoading(false);
    },
    [data],
    1500,
  );

  useEffect(() => {
    getUnifiedPosition({
      actionFunc: (position) => {
        setCurrentGisInfo(position);
      },
      isAlertError: false,
    });
  }, []);

  return (
    <>
      <HeaderLayout
        HeaderLayoutStyle={{
          ...LocationHeaderContainer,
          ...{ position: 'static' },
        }}
        isInsetTopMatin={false}
      >
        <LocationHeaderWrap>
          <SearchContainerWrap>
            <SearchInputTemplate
              placeholder={LOCATION_SEARCH_INPUT_PHARSE_TEXT}
              searchInputRef={searchInputRef}
              deleteButtonRef={deleteButtonRef}
              setLoading={setLoading}
              isSearchInputActive={isLocationSearchInputActive}
              setIsSearchInputActive={setIsLocationSearchInputActive}
              searchTempWord={locationSearchTempWord}
              setSearchTempWord={setLocationSearchTempWord}
              debouncedGetSearchQuery={debouncedGetSearchQuery}
              onClicDeletekFunc={() => {
                setLocationSearchWord('');
              }}
              onEmptyTermFunc={() => {
                setLocationSearchWord('');
              }}
            />
          </SearchContainerWrap>
        </LocationHeaderWrap>
      </HeaderLayout>
      {loading && isLocationSearchInputActive && (
        <LoadingComponent
          LoadingComponentStyle={{
            top: `${theme.systemSize.header.heightNumber * 4}px`,
            transform: 'translate(-50%,0px)',
          }}
        />
      )}
    </>
  );
};

const LocationHeaderWrap = styled.div`
  margin: auto 0;
  width: 100%;
  display: flex;
`;

const SearchContainerWrap = styled.div`
  padding: 0 10px;
  display: flex;
  width: 100%;
`;

export default LocationSearchHeader;
