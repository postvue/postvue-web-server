import SearchButtonInput from 'components/common/input/SearchButtonInput';
import React from 'react';

import { DebouncedFunc } from 'lodash';
import { SetterOrUpdater } from 'recoil';
import { isValidString } from '../../../global/util/ValidUtil';

interface SearchInputElementProps {
  placeholder: string;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  deleteButtonRef?: React.RefObject<HTMLDivElement>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchInputActive: boolean;
  setIsSearchInputActive: SetterOrUpdater<boolean>;
  searchTempWord: string;
  setSearchTempWord:
    | SetterOrUpdater<string>
    | React.Dispatch<React.SetStateAction<string>>;
  debouncedGetSearchQuery: DebouncedFunc<(searchQuery: string) => void>;
  onSearchQuery?: () => void;
  onClicDeletekFunc?: () => void;
  SearchButtonInputLayoutStyle?: React.CSSProperties;
  hasHandlePress?: boolean;
}

const SearchInputTemplate: React.FC<SearchInputElementProps> = ({
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
  onClicDeletekFunc,
  SearchButtonInputLayoutStyle,
  hasHandlePress = true,
}) => {
  const onFocusBySearchInputActive = () => {
    setIsSearchInputActive(true);
  };

  const isEmptyTermFunc = () => {
    setSearchTempWord('');
    if (onClicDeletekFunc) {
      onClicDeletekFunc();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setSearchTempWord(word);
    setLoading(true);
    if (isValidString(word)) {
      debouncedGetSearchQuery(word);
    }

    if (!isValidString(word)) {
      setLoading(false);
      isEmptyTermFunc();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      setIsSearchInputActive(false);
      if (onSearchQuery) {
        console.log('힝');
        onSearchQuery();
      }
    }
  };

  return (
    <SearchButtonInput
      placeholder={placeholder}
      onSearchInputChange={handleChange}
      onSearchInputKeyDown={hasHandlePress ? handleKeyPress : undefined}
      value={searchTempWord}
      onClickDelete={isEmptyTermFunc}
      onSearchInputOnFocus={onFocusBySearchInputActive}
      deleteButtonRef={deleteButtonRef}
      searchInputRef={searchInputRef}
      isActiveDeleteButton={searchTempWord !== '' && isSearchInputActive}
      SearchButtonInputLayoutStyle={SearchButtonInputLayoutStyle}
    />
  );
};

export default SearchInputTemplate;
