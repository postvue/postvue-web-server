import { debounce, DebouncedFunc } from 'lodash';
import { useCallback } from 'react';
import {
  LOCAL_STORAGE_LIST_INIT_VALUE,
  RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
} from '../../const/LocalStorageConst';
import {
  RECENTLY_WORD_LIST_NUM,
  SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME,
} from '../../const/SearchConst';
import { SearchRecentKeywordInterface } from '../interface/localstorage/SearchInterface';

export const handleSearch = (searchWord: string): void => {
  addRecentlyKeywordList(searchWord);
};

export const getRecentSearchWordList = (): SearchRecentKeywordInterface[] => {
  const recentlyKeywordList: SearchRecentKeywordInterface[] = JSON.parse(
    localStorage.getItem(RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE) ||
      LOCAL_STORAGE_LIST_INIT_VALUE,
  );
  return recentlyKeywordList;
};

const addRecentlyKeywordList = (
  searchTerm: string,
): SearchRecentKeywordInterface[] => {
  const recentlyKeywordList: SearchRecentKeywordInterface[] = JSON.parse(
    localStorage.getItem(RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE) ||
      LOCAL_STORAGE_LIST_INIT_VALUE,
  );

  const index = recentlyKeywordList.findIndex(
    (item) => item.name === searchTerm,
  );

  if (index !== -1) {
    recentlyKeywordList[index].isExposed = true;
    const item = recentlyKeywordList.splice(index, 1)[0];
    recentlyKeywordList.push(item);
  } else {
    if (recentlyKeywordList.length >= RECENTLY_WORD_LIST_NUM) {
      recentlyKeywordList.splice(0, 1);
    }
    recentlyKeywordList.push({ name: searchTerm, isExposed: true });
  }

  localStorage.setItem(
    RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
    JSON.stringify(recentlyKeywordList),
  );

  return recentlyKeywordList;
};

export const deleteRecentlyKeyword = (
  searchWord: string,
): SearchRecentKeywordInterface[] => {
  const recentlyKeywordList: SearchRecentKeywordInterface[] = JSON.parse(
    localStorage.getItem(RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE) ||
      LOCAL_STORAGE_LIST_INIT_VALUE,
  );

  if (recentlyKeywordList.length <= 0) {
    return recentlyKeywordList;
  }

  const index = recentlyKeywordList.findIndex(
    (item) => item.name === searchWord,
  );

  if (index !== -1) {
    recentlyKeywordList[index].isExposed = true;
    recentlyKeywordList.splice(index, 1);
  }

  localStorage.setItem(
    RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
    JSON.stringify(recentlyKeywordList),
  );

  return recentlyKeywordList;
};

export const removeRecentlyKeywordList = (): void => {
  localStorage.setItem(
    RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
    LOCAL_STORAGE_LIST_INIT_VALUE,
  );
};

export const getSearchQueryByDebounce = (
  func: (searchQuery: string) => void,
  deps: React.DependencyList,
  time = SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME,
): DebouncedFunc<(searchQuery: string) => void> => {
  return useCallback(
    debounce((searchQuery: string) => {
      func(searchQuery);
    }, time), // 디바운스, 600ms
    deps,
  );
};
