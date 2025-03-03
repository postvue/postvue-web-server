import { useMapV1 } from 'components/lib/mapkitjs/useMapV1';
import { APPLE_SEARCH_AUTO_COMPLETE_LIMIT_COURTRY_LIST } from 'const/MapExploreConst';
import {
  MAP_EXPLORE_SEARCH_LOCATION_TAB_ID,
  MAP_EXPLORE_SEARCH_POST_TAB_ID,
  MAP_EXPLORE_SEARCH_RECOMM_TAB_ID,
} from 'const/TabConfigConst';
import { MapLocalSrchRsp, MapRecommSrchRsp } from 'global/interface/map';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  mapAppleSearchListCacheAtom,
  MapMoveLocationType,
} from 'states/MapExploreAtom';

interface SearchProps {
  mapSearchWord: string;
  mapLocalSearchList?: MapLocalSrchRsp[];
  mapExploreSearchTabId: number;
  mapRecommSearchList?: MapRecommSrchRsp[];
  geoPos?: {
    latitude: number;
    longitude: number;
  };
  mapMoveLocation: MapMoveLocationType;
  isActive: boolean | null;
  onDeactive?: () => void;
}

interface SearchResult {
  mapAppleSearchList: MapLocalSrchRsp[] | undefined;
  isFetchedByMapAppleSearchList: boolean;
}

export const useAppleMapSearchWithCache = (
  searchProps: SearchProps,
): SearchResult => {
  const { mapkit } = useMapV1();
  const [mapAppleSearchList, setMapAppleSearchList] = useState<
    MapRecommSrchRsp[] | undefined
  >(undefined);

  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [mapAppleSearchCache, setMapAppleSearchCache] = useRecoilState(
    mapAppleSearchListCacheAtom,
  );

  const process = () => {
    const keyword = convertQueryTemplate(
      convertQueryTemplate(
        convertQueryTemplate(
          searchProps.mapMoveLocation.regionInfo.continentCode,
          searchProps.mapMoveLocation.regionInfo.countryCode,
        ),
        searchProps.mapMoveLocation.regionInfo.city,
      ),
      searchProps.mapSearchWord,
    );

    // 현재 recomm, location 데이터를 가져오지 않은 상태
    if (
      searchProps.mapExploreSearchTabId === MAP_EXPLORE_SEARCH_POST_TAB_ID ||
      (!searchProps.mapLocalSearchList &&
        searchProps.mapExploreSearchTabId ===
          MAP_EXPLORE_SEARCH_LOCATION_TAB_ID) ||
      (searchProps.mapExploreSearchTabId === MAP_EXPLORE_SEARCH_RECOMM_TAB_ID &&
        !searchProps.mapRecommSearchList)
    ) {
      setIsFetch(false);
      return;
    }

    if (
      (searchProps.mapLocalSearchList &&
        searchProps.mapLocalSearchList.length <= 0) ||
      (searchProps.mapRecommSearchList &&
        searchProps.mapRecommSearchList.filter((v) => v.isPlace === true)
          .length <= 0) ||
      (searchProps.isActive !== null && searchProps.isActive)
    ) {
      // 지도 api가 초기화 안됐거나 아니면 검색어가 문제 있을 떄,
      if (!mapkit || !isValidString(searchProps.mapSearchWord)) {
        setMapAppleSearchList(undefined);
        setIsFetch(true);
        return;
      }

      // 캐시에 동일한 검색어가 존재하면 API 호출 없이 데이터 설정
      const searchCache = new Map(mapAppleSearchCache);

      if (searchCache.has(keyword)) {
        setMapAppleSearchList(searchCache.get(keyword));

        setIsFetch(true);
        return;
      }

      // 새로운 검색 요청
      const search = new mapkit.Search({
        language: 'ko-KR',
        coordinate:
          searchProps.geoPos &&
          new mapkit.Coordinate(
            searchProps.geoPos.latitude,
            searchProps.geoPos.longitude,
          ),
      });

      const autoCompleteProps: any = {
        limitToCountries: APPLE_SEARCH_AUTO_COMPLETE_LIMIT_COURTRY_LIST,
      };
      if (
        searchProps.geoPos &&
        searchProps.geoPos.latitude &&
        searchProps.geoPos.longitude
      ) {
        autoCompleteProps.coordinate = new mapkit.Coordinate(
          searchProps.geoPos.latitude,
          searchProps.geoPos.longitude,
        );
      }

      search.autocomplete(
        searchProps.mapSearchWord,
        (error, data) => {
          if (error) {
            console.error(error);
            alert(error.message);
            return;
          }

          const results = data.results
            .map((v: any) => {
              const placeObject: mapkit.Place = v;
              const displayLines: mapkit.SearchAutocompleteResult = v;

              const place = placeObject ? placeObject : null;
              const coordinate: mapkit.Coordinate | null = place
                ? place.coordinate
                : null;
              return {
                isPlace: place ? true : false,
                roadAddr: place ? place.fullThoroughfare || '' : '',
                placeName: displayLines ? displayLines.displayLines[0] : '',
                hasLocation: coordinate ? true : false,
                latitude: coordinate ? coordinate.latitude : 0,
                longitude: coordinate ? coordinate.longitude : 0,
                searchQueryName: '',
              };
            })
            .filter((v) => v.hasLocation === true);
          setMapAppleSearchList(results);

          const searchCache = new Map(mapAppleSearchCache);

          searchCache.set(keyword, results);

          setMapAppleSearchCache(searchCache);

          setIsFetch(true);
        },
        autoCompleteProps,
      );
    } else {
      const searchCache = new Map(mapAppleSearchCache);
      const results = searchCache.get(keyword);
      setIsFetch(true);
      setMapAppleSearchList(results);
    }
  };

  useEffect(() => {
    process();
    if (!searchProps.onDeactive) return;
    searchProps.onDeactive();
  }, [
    searchProps.mapSearchWord,
    searchProps.mapLocalSearchList,
    searchProps.mapRecommSearchList,
    searchProps.mapExploreSearchTabId,
    searchProps.isActive,
  ]);

  return {
    mapAppleSearchList: mapAppleSearchList,
    isFetchedByMapAppleSearchList: isFetch,
  };
};

export default useAppleMapSearchWithCache;
