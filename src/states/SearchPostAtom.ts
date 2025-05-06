import {
  SEARCH_PAGE_PROFILE_TAB_ID,
  SEARCH_POST_POPULAR_QUERY_PARAM,
  SearchPostFilterTabType,
} from 'const/TabConfigConst';
import { atom } from 'recoil';
import { INIT_EMPTY_STRING_VALUE } from '../const/AttributeConst';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { PostRsp } from '../global/interface/post';
import {
  GetFavoriteTermRsp,
  SearchPostResultInfoInterface,
} from '../global/interface/search';

interface PostHashMapBySearchWordInterface {
  postHashMap: Map<string, PostRsp>;
  position: number;
  currentCursorId: string;
}

export const searchPostHashMapBySearhQueryAtom = atom<
  Map<string, PostHashMapBySearchWordInterface>
>({
  key: 'searchPostHashMapBySearhQuery',
  default: new Map(),
});

export const searchPostHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'searchPostHashMap',
  default: new Map(),
});

export const cursorIdAtomBySearchPost = atom<string>({
  key: 'cursorIdBySearchPost',
  default: INIT_CURSOR_ID,
});

export const searchWordAtom = atom<string>({
  key: 'searchWord',
  default: INIT_EMPTY_STRING_VALUE,
});

export const searchTempWordAtom = atom<string>({
  key: 'searcTemphWord',
  default: INIT_EMPTY_STRING_VALUE,
});

export const searchTempWordQueryAtom = atom<string>({
  key: 'searcTempQueryhWord',
  default: INIT_EMPTY_STRING_VALUE,
});

export const isSearchInputActiveAtom = atom<boolean>({
  key: 'isSearchInputActive',
  default: false,
});

export const searchQueryRelationHashMapAtom = atom<Map<string, string[]>>({
  key: 'searchQueryRelationHashMap',
  default: new Map(),
});

export const searchScrollPositionStateAtom = atom<number>({
  key: 'searchScrollPositionState',
  default: 0,
});

export const searchFavoriteTermListAtom = atom<GetFavoriteTermRsp[]>({
  key: 'searchFavoriteTermList',
  default: [],
});

export const searchQueryAndFilterKeyAtom = atom<string>({
  key: 'searchQueryAndFilterKey',
  default: SEARCH_POST_POPULAR_QUERY_PARAM,
});

export const searchPostResultInfoAtom = atom<
  Map<string, SearchPostResultInfoInterface>
>({
  key: 'searchPostResultInfo',
  default: new Map(),
});

export const isActiveSearchPostFilterPopupAtom = atom<boolean>({
  key: 'isActiveSearchPostFilterPopup',
  default: false,
});

export const isActiveSearchFavoritePopupAtom = atom<boolean>({
  key: 'isActiveSearchFavoritesPopup',
  default: false,
});

export const searchPostExploreFilterTabAtom = atom<SearchPostFilterTabType>({
  key: 'searchPostExploreFilterTab',
  default: SEARCH_POST_POPULAR_QUERY_PARAM,
});

export const currentPositionSearchPostAtom = atom<{
  latitude?: number;
  longitude?: number;
}>({
  key: 'currentPositionSearchPost',
  default: {
    latitude: undefined,
    longitude: undefined,
  },
});

export interface SearchTabInfo {
  tabId: number;
}

export const searchTabInfoAtom = atom<SearchTabInfo>({
  key: 'searchTabInfo',
  default: {
    tabId: SEARCH_PAGE_PROFILE_TAB_ID,
  },
});
