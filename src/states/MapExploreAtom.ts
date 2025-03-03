import { INIT_EMPTY_STRING_VALUE } from 'const/AttributeConst';
import {
  MAP_CONTENT_LOCATION_TYPE,
  MAP_EXPLORE_INIT_LATITUDE,
  MAP_EXPLORE_INIT_LONGITUDE,
  MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE,
  MapContentType,
  MapExplorePostPopupStateType,
} from 'const/MapExploreConst';
import {
  MAP_EXPLORE_ALL_TAB_PARAM,
  MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
  MapExploreTabType,
} from 'const/TabConfigConst';
import { MapRecommSrchRsp } from 'global/interface/map';
import { PostRsp } from 'global/interface/post';
import { atom } from 'recoil';

export interface RegionInfo {
  city: string;
  continent: string;
  continentCode: string;
  countryCode: string;
  countryName: string;
  locality: string;
}

export interface MapMoveLocationType {
  latitude: number;
  longitude: number;
  isMoved: boolean;
  regionInfo: RegionInfo;
}

export interface GeoPositionInterface {
  latitude: number;
  longitude: number;
  isMoveCenter: boolean;
}

export const mapLoactionAtom = atom<GeoPositionInterface>({
  key: 'mapLoaction',
  default: {
    latitude: MAP_EXPLORE_INIT_LATITUDE,
    longitude: MAP_EXPLORE_INIT_LONGITUDE,
    isMoveCenter: true,
  },
});

export const mapClusterPostListInfoAtom = atom<{
  isActive: boolean;
  mapPostList: PostRsp[];
}>({
  key: 'mapClusterPostListInfo',
  default: {
    isActive: false,
    mapPostList: [],
  },
});

export const mapMoveLocationAtom = atom<MapMoveLocationType>({
  key: 'mapAddressByGeo',
  default: {
    latitude: 37.5667,
    longitude: 126.9783,
    isMoved: false,
    regionInfo: {
      city: '',
      continent: '',
      continentCode: '',
      countryCode: '',
      countryName: '',
      locality: '',
    },
  },
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

export const mapContentTypeAtom = atom<MapContentType>({
  key: 'mapContentType',
  default: MAP_CONTENT_LOCATION_TYPE,
});

export const mapExploreFilterTabAtom = atom<MapExploreTabType>({
  key: 'mapExploreFilterTab',
  default: MAP_EXPLORE_ALL_TAB_PARAM,
});

export const isMapExplorePopupAtom = atom<boolean>({
  key: 'isMapExplorePopup',
  default: false,
});

export const mapExplorePostPopupStateAtom = atom<MapExplorePostPopupStateType>({
  key: 'mapExplorePostPopupState',
  default: MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE,
});

export const isClickAnnotationAtom = atom<boolean | null>({
  key: 'isClickAnnotation',
  default: null,
});

export const isActiveMyMapAtom = atom<boolean>({
  key: 'isActiveMyMap',
  default: false,
});

export const mapDatePickerPopupInfoAtom = atom<{
  isActive: boolean;
  dateInfo: {
    startDate: Date | null;
    endDate: Date | null;
  };
}>({
  key: 'mapDatePickerPopupInfo',
  default: {
    isActive: false,
    dateInfo: {
      startDate: null,
      endDate: null,
    },
  },
});

export const isMapDatePickerPopupAtom = atom<boolean>({
  key: 'isMapDatePickerPopup',
  default: false,
});

export const isMapDateRangePickerPopupAtom = atom<boolean>({
  key: 'isMapDateRangePickerPopup',
  default: false,
});

export const currentSearchQueryAtom = atom<string>({
  key: 'currentSearchQuery',
  default: '',
});

export const mapAppleSearchListCacheAtom = atom<
  Map<string, MapRecommSrchRsp[]>
>({
  key: 'mapAppleSearchListCache',
  default: new Map(),
});

export const isInitListerAtom = atom<boolean>({
  key: 'isInitLister',
  default: false,
});

export interface SelectReverseGeoCodeMapInteface {
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export const selectReverseGeoCodeMapAtom =
  atom<SelectReverseGeoCodeMapInteface>({
    key: 'selectReverseGeoCodeMap',
    default: {
      latitude: MAP_EXPLORE_INIT_LATITUDE,
      longitude: MAP_EXPLORE_INIT_LONGITUDE,
      isActive: false,
    },
  });

export const currentAnnotationAtom = atom<mapkit.MarkerAnnotation | null>({
  key: 'currentAnnotation',
  default: null,
});

export const geocoderAtom = atom<mapkit.Geocoder | null>({
  key: ' geocoder',
  default: null,
});
