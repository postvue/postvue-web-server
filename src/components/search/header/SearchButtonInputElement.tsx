import SearchButtonInput from 'components/common/input/SearchButtonInput';
import {
  SEARCH_INPUT_PROFILE_PHARSE_TEXT,
  SEARCH_INPUT_SCRAP_PHARSE_TEXT,
} from 'const/SystemPhraseConst';
import React from 'react';

import { RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE } from 'const/LocalStorageConst';
import { SEARCH_TAG_POST_ROUTE_PATH } from 'const/PathConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { SEARCH_PAGE_PROFILE_TAB_ID } from 'const/TabConfigConst';
import { useRef } from 'react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  getSearchQueryByDebounce,
  handleSearch,
  removeHashTag,
  startsWithHashTag,
} from '../../../global/util/SearchUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import {
  isSearchInputActiveAtom,
  searchTabInfoAtom,
  searchTempWordAtom,
  searchTempWordQueryAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';

interface SearchButtonInputElementProps {
  searchInputRef: React.RefObject<HTMLInputElement>;
  deleteButtonRef: React.RefObject<HTMLDivElement>;
  isShowFavoriteTermButton?: boolean;
  favoriteTermButton?: React.ReactNode;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  searchUrl: string;
  SearchButtonInputLayoutStyle?: React.CSSProperties;
}

const SearchButtonInputElement: React.FC<SearchButtonInputElementProps> = ({
  searchInputRef,
  deleteButtonRef,
  isShowFavoriteTermButton,
  favoriteTermButton,
  setLoading,
  searchUrl,
  SearchButtonInputLayoutStyle,
}) => {
  const searchScrollPositionRef = useRef<number>(0);

  const navigate = useNavigate();
  const location = useLocation();

  const searchWord = useRecoilValue(searchWordAtom);

  const [searchTempWord, setSearchTempWord] =
    useRecoilState(searchTempWordAtom);

  const [searchTempWordQuery, setSearchTempWordQuery] = useRecoilState(
    searchTempWordQueryAtom,
  );

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

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      setSearchTempWordQuery(word);
      setLoading(false);
    },
    [searchTempWordQuery],
  );

  // const debouncedGetSearchQuery = useCallback(
  //   debounce((word: string) => {
  //     if (!searchQueryRelationHashMap.get(word)) {
  //       getSearchQuery(word)
  //         .then((value) => {
  //           const tempSearchQueryRelationHashMap = new Map(
  //             searchQueryRelationHashMap,
  //           );
  //           tempSearchQueryRelationHashMap.set(word, value);
  //           setSearchQueryRelationHashMap(tempSearchQueryRelationHashMap);
  //         })
  //         .finally(() => setLoading(false));
  //     }
  //   }, SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME), // 디바운스, 600ms
  //   [searchQueryRelationHashMap],
  // );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setLoading(true);
    if (isValidString(word)) {
      debouncedGetSearchQuery(word);
    }

    setSearchTempWord(word);

    if (!isValidString(word)) {
      setLoading(false);
      isEmptyTermFunc();
    }
  };

  const onClickSearchButton = () => {
    if (searchTempWord !== '' && searchWord !== searchTempWord) {
      handleSearch(RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE, searchTempWord);

      const data: RoutePushEventDateInterface = {
        isShowInitBottomNavBar: true,
      };

      if (startsWithHashTag(searchTempWord)) {
        // stackRouterPush(
        //   navigate,
        //   generatePath(SEARCH_TAG_POST_ROUTE_PATH, {
        //     search_word: removeHashTag(searchTempWord),
        //   }),
        //   data,
        // );
        navigate(
          generatePath(SEARCH_TAG_POST_ROUTE_PATH, {
            search_word: removeHashTag(searchTempWord),
          }),
        );
      } else {
        // stackRouterPush(navigate, `${searchUrl}/${searchTempWord}`, data);
        navigate(`${searchUrl}/${searchTempWord}`);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.nativeEvent.isComposing === false) {
      onClickSearchButton();
      setTimeout(() => {
        setIsSearchInputActive(false);
      }, 300);
    }
  };

  const searchTabInfo = useRecoilValue(searchTabInfoAtom);

  return (
    <SearchButtonInput
      placeholder={
        searchTabInfo.tabId === SEARCH_PAGE_PROFILE_TAB_ID
          ? SEARCH_INPUT_PROFILE_PHARSE_TEXT
          : SEARCH_INPUT_SCRAP_PHARSE_TEXT
      }
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
      SearchButtonInputLayoutStyle={SearchButtonInputLayoutStyle}
    />
  );
};

export default SearchButtonInputElement;
