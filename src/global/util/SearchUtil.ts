import { debounce, DebouncedFunc } from 'lodash';
import { useCallback } from 'react';
import { LOCAL_STORAGE_LIST_INIT_VALUE } from '../../const/LocalStorageConst';
import {
  RECENTLY_WORD_LIST_NUM,
  SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME,
  SEARCH_WORD_POST_TYPE,
} from '../../const/SearchConst';
import { SearchRecentKeywordInterface } from '../interface/localstorage/SearchInterface';

export const handleSearch = (
  recentKeywordStorageName: string,
  searchWord: string,
): void => {
  addRecentlyKeywordList(recentKeywordStorageName, searchWord);
};

export const getRecentSearchWordList = (
  recentKeywordStorageName: string,
): SearchRecentKeywordInterface[] => {
  const recentlyKeywordList: SearchRecentKeywordInterface[] = JSON.parse(
    localStorage.getItem(recentKeywordStorageName) ||
      LOCAL_STORAGE_LIST_INIT_VALUE,
  );
  return recentlyKeywordList;
};

const addRecentlyKeywordList = (
  recentKeywordStorageName: string,
  searchTerm: string,
): SearchRecentKeywordInterface[] => {
  const recentlyKeywordList: SearchRecentKeywordInterface[] = JSON.parse(
    localStorage.getItem(recentKeywordStorageName) ||
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
    recentlyKeywordList.push({
      name: searchTerm,
      isExposed: true,
      searchWordType: SEARCH_WORD_POST_TYPE,
    });
  }

  localStorage.setItem(
    recentKeywordStorageName,
    JSON.stringify(recentlyKeywordList),
  );

  return recentlyKeywordList;
};

export const deleteRecentlyKeyword = (
  recentKeywordStorageName: string,
  searchWord: string,
): SearchRecentKeywordInterface[] => {
  const recentlyKeywordList: SearchRecentKeywordInterface[] = JSON.parse(
    localStorage.getItem(recentKeywordStorageName) ||
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
    recentKeywordStorageName,
    JSON.stringify(recentlyKeywordList),
  );

  return recentlyKeywordList;
};

export const removeRecentlyKeywordList = (
  recentKeywordStorageName: string,
): void => {
  localStorage.setItem(recentKeywordStorageName, LOCAL_STORAGE_LIST_INIT_VALUE);
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

export function startsWithHashTag(searchWord: string): boolean {
  return searchWord.startsWith('#');
}

export function addHashTag(searchWord: string): string {
  return searchWord.startsWith('#') ? searchWord : `#${searchWord}`;
}

export function removeHashTag(searchWord: string): string {
  return searchWord.startsWith('#') ? searchWord.substring(1) : searchWord;
}
