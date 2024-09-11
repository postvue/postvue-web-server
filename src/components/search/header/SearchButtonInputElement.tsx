import SearchButtonInput from 'components/common/input/SearchButtonInput';
import { SEARCH_INPUT_PHARSE_TEXT } from 'const/SystemPhraseConst';
import React from 'react';

import { debounce } from 'lodash';
import { useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { SEARCH_PATH } from '../../../const/PathConst';
import { SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME } from '../../../const/SearchConst';
import { isValidString } from '../../../global/util/\bValidUtil';
import { handleSearch } from '../../../global/util/SearchUtil';
import { getSearchQuery } from '../../../services/search/getSearchQuery';
import {
  isSearchInputActiveAtom,
  searchQueryRelationHashMapAtom,
  searchTempWordAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';

interface SearchButtonInputElementProps {
  searchInputRef: React.RefObject<HTMLInputElement>;
  deleteButtonRef: React.RefObject<HTMLDivElement>;
  isShowFavoriteTermButton?: boolean;
  favoriteTermButton?: React.ReactNode;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchButtonInputElement: React.FC<SearchButtonInputElementProps> = ({
  searchInputRef,
  deleteButtonRef,
  isShowFavoriteTermButton,
  favoriteTermButton,
  setLoading,
}) => {
  const searchScrollPositionRef = useRef<number>(0);

  const navigate = useNavigate();
  const location = useLocation();

  const searchWord = useRecoilValue(searchWordAtom);

  const [searchTempWord, setSearchTempWord] =
    useRecoilState(searchTempWordAtom);

  const [searchQueryRelationHashMap, setSearchQueryRelationHashMap] =
    useRecoilState(searchQueryRelationHashMapAtom);

  // 검색 입력 focus 관련 상태 관리
  const [isSearchInputActive, setIsSearchInputActive] = useRecoilState(
    isSearchInputActiveAtom,
  );

  const onFocusBySearchInputActive = () => {
    setIsSearchInputActive(true);

    searchScrollPositionRef.current = window.scrollY;
  };

  const isEmptyTermFunc = () => {
    setSearchTempWord('');
    const state = {};
    history.replaceState(state, '', location.pathname);
  };

  const debouncedGetSearchQuery = useCallback(
    debounce((word: string) => {
      if (!searchQueryRelationHashMap.get(word)) {
        getSearchQuery(word)
          .then((value) => {
            const tempSearchQueryRelationHashMap = new Map(
              searchQueryRelationHashMap,
            );
            tempSearchQueryRelationHashMap.set(word, value);
            setSearchQueryRelationHashMap(tempSearchQueryRelationHashMap);
          })
          .finally(() => setLoading(false));
      }
    }, SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME), // 디바운스, 600ms
    [searchQueryRelationHashMap],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setLoading(true);
    if (isValidString(word)) {
      debouncedGetSearchQuery(word);
    }

    setSearchTempWord(word);
    if (searchQueryRelationHashMap.get(word)) {
      setLoading(false);
    }
    if (!isValidString(word)) {
      setLoading(false);
      isEmptyTermFunc();
    }
  };

  const onClickSearchButton = () => {
    if (searchTempWord !== '' && searchWord !== searchTempWord) {
      handleSearch(searchTempWord);
      navigate(`${SEARCH_PATH}/${searchTempWord}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      onClickSearchButton();
      setIsSearchInputActive(false);
    }
  };

  return (
    <SearchButtonInput
      placeholder={SEARCH_INPUT_PHARSE_TEXT}
      onSearchInputChange={handleChange}
      onSearchInputKeyDown={handleKeyPress}
      value={searchTempWord}
      onClickDelete={isEmptyTermFunc}
      onSearchInputOnFocus={onFocusBySearchInputActive}
      deleteButtonRef={deleteButtonRef}
      searchInputRef={searchInputRef}
      isActiveDeleteButton={searchTempWord !== '' && isSearchInputActive}
      isShowAddElement={isShowFavoriteTermButton}
      addElement={favoriteTermButton}
    />
  );
};

export default SearchButtonInputElement;
