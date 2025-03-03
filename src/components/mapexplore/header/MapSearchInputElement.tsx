import React from 'react';

import { ReactComponent as DeleteSearchInputIcon } from 'assets/images/icon/svg/DeleteSearchInputIcon.svg';
import { ReactComponent as SearchIcon } from 'assets/images/icon/svg/search/SearchIcon.svg';
import { returnMapPeriodDate } from 'global/util/DateTimeUtil';
import { DebouncedFunc } from 'lodash';
import { SetterOrUpdater, useRecoilValue } from 'recoil';
import { mapDatePickerPopupInfoAtom } from 'states/MapExploreAtom';
import styled from 'styled-components';
import { isValidString } from '../../../global/util/ValidUtil';

interface MapSearchInputElementProps {
  placeholder: string;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  deleteButtonRef?: React.RefObject<HTMLDivElement>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchInputActive: boolean;
  setIsSearchInputActive: SetterOrUpdater<boolean>;
  searchTempWord: string;
  setSearchTempWord:
    | SetterOrUpdater<string>
    | React.Dispatch<React.SetStateAction<string>>;
  debouncedGetSearchQuery: DebouncedFunc<(searchQuery: string) => void>;
  onSearchQuery?: () => void;
  onEmptyTermFunc?: () => void;
  SearchButtonInputLayoutStyle?: React.CSSProperties;
  hasHandlePress?: boolean;
}

const MapSearchInputElement: React.FC<MapSearchInputElementProps> = ({
  placeholder,
  searchInputRef,
  deleteButtonRef,
  setLoading,
  isSearchInputActive,
  setIsSearchInputActive,
  searchTempWord,
  setSearchTempWord,
  debouncedGetSearchQuery,
  onSearchQuery,
  onEmptyTermFunc,
  SearchButtonInputLayoutStyle,
  hasHandlePress = true,
}) => {
  const onFocusBySearchInputActive = () => {
    setIsSearchInputActive(true);
  };

  const isEmptyTermFunc = () => {
    setSearchTempWord('');
    if (onEmptyTermFunc) {
      onEmptyTermFunc();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setSearchTempWord(word);
    if (setLoading) {
      setLoading(true);
    }

    if (isValidString(word)) {
      debouncedGetSearchQuery(word);
    }

    if (!isValidString(word)) {
      if (setLoading) {
        setLoading(false);
      }
      isEmptyTermFunc();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      setIsSearchInputActive(false);
      if (onSearchQuery) {
        onSearchQuery();
      }
    }
  };

  const mapDatePickerPopupInfo = useRecoilValue(mapDatePickerPopupInfoAtom);

  return (
    <MapSearchINputTemplateWrap>
      <SearchWrap
        style={SearchButtonInputLayoutStyle}
        $isActiveDatePicker={mapDatePickerPopupInfo.isActive}
      >
        <SearchButton>
          <SearchIconWrap>
            <SearchIcon />
          </SearchIconWrap>
          <SearchInputContainer>
            <SearchInputWrap>
              <SearchInput
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={hasHandlePress ? handleKeyPress : undefined}
                value={searchTempWord}
                onFocus={onFocusBySearchInputActive}
                ref={searchInputRef}
              />
              {isEmptyTermFunc !== undefined && (
                <>
                  {searchTempWord !== '' && isSearchInputActive && (
                    <DeleteSearchButton
                      ref={deleteButtonRef}
                      onClick={isEmptyTermFunc}
                    >
                      <DeleteSearchInputIcon />
                    </DeleteSearchButton>
                  )}
                </>
              )}
            </SearchInputWrap>
            {!isSearchInputActive &&
              mapDatePickerPopupInfo.isActive &&
              mapDatePickerPopupInfo.dateInfo.startDate &&
              mapDatePickerPopupInfo.dateInfo.endDate && (
                <SearchPeriod>
                  {returnMapPeriodDate(
                    mapDatePickerPopupInfo.dateInfo.startDate,
                  )}{' '}
                  ~{' '}
                  {returnMapPeriodDate(mapDatePickerPopupInfo.dateInfo.endDate)}
                </SearchPeriod>
              )}
          </SearchInputContainer>
        </SearchButton>
      </SearchWrap>
    </MapSearchINputTemplateWrap>
  );
};

const MapSearchINputTemplateWrap = styled.div`
  width: 100%;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  padding: 0px 0px 0 7px;
`;

const SearchInputWrap = styled.div`
  width: 100%;
  display: flex;
`;

const SearchInput = styled.input`
  margin: auto 0;
  color: #d3d5d6;
  width: 100%;
  border: 0px;
  height: 100%;
  background: none;
  padding: 0px;

  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 15px;
  color: ${({ theme }) => theme.grey.Grey6};

  &: focus {
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.grey.Grey6};
  }
`;

const DeleteSearchButton = styled.div`
  display: flex;
  padding-right: 5px;
  cursor: pointer;
`;

const SearchWrap = styled.div<{ $isActiveDatePicker: boolean }>`
  border-radius: 30px;
  background-color: ${({ theme }) => theme.grey.Grey1};
  height: ${(props) => (props.$isActiveDatePicker ? '45px' : '34px')};

  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SearchButton = styled.div`
  display: flex;
  width: 100%;
`;

const SearchPeriod = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey5};
`;

const SearchIconWrap = styled.div`
  padding-left: 10px;
  margin: auto 0;
`;

export default MapSearchInputElement;
