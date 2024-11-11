import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import { MAP_CONTENT_LOCATION_TYPE } from 'const/MapExploreConst';
import {
  MAP_EXPLORE_ALL_TAB_PARAM,
  MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
} from 'const/TabConfigConst';
import { GeoPositionInterface } from 'global/util/MapExploreUtil';
import { atom } from 'recoil';

export const mapLoactionAtom = atom<GeoPositionInterface>({
  key: 'mapLoaction',
  default: {
    latitude: 0,
    longitude: 0,
  },
});

export const mapMoveLoactionAtom = atom<{
  latitude: number;
  longitude: number;
  isMoved: boolean;
}>({
  key: 'mapAddressByGeo',
  default: {
    latitude: 0,
    longitude: 0,
    isMoved: false,
  },
});

export const mapExploreFilterTabAtom = atom<string>({
  key: 'mapExploreFilterTab',
  default: MAP_EXPLORE_ALL_TAB_PARAM,
});

export const isMapSearchInputActiveAtom = atom<boolean>({
  key: 'isMapSearchInputActive',
  default: false,
});

export const isMapSLocationLoadingAtom = atom<boolean>({
  key: 'isMapSLocationLoading',
  default: false,
});

export const mapExploreSearchTabIdAtom = atom<number>({
  key: 'mapExploreSearchTabId',
  default: MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
});

export const mapSearchTempWordAtom = atom<string>({
  key: 'mapSearchTempWord',
  default: INIT_EMPTY_STRING_VALUE,
});

export const mapSearchPostWordAtom = atom<string>({
  key: 'mapSearchPostWord',
  default: INIT_EMPTY_STRING_VALUE,
});

export const isMapExploreSearchResultActiveAtom = atom<boolean>({
  key: 'isMapExploreSearchResultActive',
  default: false,
});

export const mapContentTypeAtom = atom<string>({
  key: 'mapContentType',
  default: MAP_CONTENT_LOCATION_TYPE,
});
