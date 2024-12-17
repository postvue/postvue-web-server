import { debounce, DebouncedFunc } from 'lodash';
import { useCallback } from 'react';
import {
  LOCAL_STORAGE_LIST_INIT_VALUE,
  MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
} from '../../const/LocalStorageConst';
import {
  RECENTLY_WORD_LIST_NUM,
  SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME,
} from '../../const/SearchConst';
import { MapSearchRecentKeywordInterface } from '../interface/localstorage/SearchInterface';

export const handleMapSearch = (
  mapSearchWordInfo: MapSearchRecentKeywordInterface,
): void => {
  addMapRecentlyKeywordList(mapSearchWordInfo);
};

export const getMapRecentSearchWordList =
  (): MapSearchRecentKeywordInterface[] => {
    const recentlyKeywordList: MapSearchRecentKeywordInterface[] = JSON.parse(
      localStorage.getItem(MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE) ||
        LOCAL_STORAGE_LIST_INIT_VALUE,
    );
    return recentlyKeywordList;
  };

const addMapRecentlyKeywordList = (
  mapSearchKeyword: MapSearchRecentKeywordInterface,
): MapSearchRecentKeywordInterface[] => {
  const recentlyKeywordList: MapSearchRecentKeywordInterface[] = JSON.parse(
    localStorage.getItem(MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE) ||
      LOCAL_STORAGE_LIST_INIT_VALUE,
  );

  const index = recentlyKeywordList.findIndex(
    (item) =>
      item.searchWordType === mapSearchKeyword.searchWordType &&
      item.name === mapSearchKeyword.name,
  );

  if (index !== -1) {
    recentlyKeywordList[index].isExposed = true;
    const item = recentlyKeywordList.splice(index, 1)[0];
    recentlyKeywordList.push(item);
  } else {
    if (recentlyKeywordList.length >= RECENTLY_WORD_LIST_NUM) {
      recentlyKeywordList.splice(0, 1);
    }
    recentlyKeywordList.push(mapSearchKeyword);
  }

  localStorage.setItem(
    MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
    JSON.stringify(recentlyKeywordList),
  );

  return recentlyKeywordList;
};

export const deleteMapRecentlyKeyword = (
  mapSearchWordInfo: MapSearchRecentKeywordInterface,
): MapSearchRecentKeywordInterface[] => {
  const recentlyKeywordList: MapSearchRecentKeywordInterface[] =
    getMapRecentSearchWordList();

  if (recentlyKeywordList.length <= 0) {
    return recentlyKeywordList;
  }

  const index = recentlyKeywordList.findIndex(
    (item) =>
      item.name === mapSearchWordInfo.name &&
      item.searchWordType === mapSearchWordInfo.searchWordType,
  );

  if (index !== -1) {
    recentlyKeywordList[index].isExposed = true;
    recentlyKeywordList.splice(index, 1);
  }

  localStorage.setItem(
    MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
    JSON.stringify(recentlyKeywordList),
  );

  return recentlyKeywordList;
};

export const initMapRecentlyKeywordList = (): void => {
  localStorage.setItem(
    MAP_RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
    LOCAL_STORAGE_LIST_INIT_VALUE,
  );
};

export const getMapSearchQueryByDebounce = (
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
