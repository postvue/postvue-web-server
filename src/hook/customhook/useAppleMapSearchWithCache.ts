import { useMap } from 'components/lib/mapkitjs/useMap';
import { APPLE_SEARCH_AUTO_COMPLETE_LIMIT_COURTRY_LIST } from 'const/MapExploreConst';
import { MapLocalSrchRsp, MapRecommSrchRsp } from 'global/interface/map';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { mapAppleSearchListCacheAtom, RegionInfo } from 'states/MapExploreAtom';

interface SearchProps {
  mapSearchWord: string;
  geoPos?: {
    latitude: number;
    longitude: number;
  };
  regionInfo?: RegionInfo;
  isActive: boolean;
  onDeactive: () => void;
}

interface SearchResult {
  mapAppleSearchList: MapLocalSrchRsp[] | undefined;
  isFetched: boolean;
  isVisible: boolean;
}

export const useAppleMapSearchWithCache = (
  searchProps: SearchProps,
): SearchResult => {
  const { mapkit } = useMap();
  const [mapAppleSearchList, setMapAppleSearchList] = useState<
    MapRecommSrchRsp[] | undefined
  >(undefined);

  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mapAppleSearchCache, setMapAppleSearchCache] = useRecoilState(
    mapAppleSearchListCacheAtom,
  );

  const generateKeyword = (): string => {
    return convertQueryTemplate(
      convertQueryTemplate(
        convertQueryTemplate(
          searchProps.regionInfo?.continentCode || '',
          searchProps.regionInfo?.countryCode || '',
        ),
        searchProps.regionInfo?.city || '',
      ),
      searchProps.mapSearchWord,
    );
  };

  const process = () => {
    const keyword = generateKeyword();

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
  };

  useEffect(() => {
    const keyword = generateKeyword();
    setIsVisible(false);
    const searchCache = new Map(mapAppleSearchCache);
    const results = searchCache.get(keyword);
    setIsFetch(results ? true : false);
    setMapAppleSearchList(results);
  }, [searchProps.mapSearchWord]);

  useEffect(() => {
    if (searchProps.isActive) {
      process();
      setIsVisible(true);
      searchProps.onDeactive();
    }
  }, [searchProps.isActive]);

  // useEffect(() => {
  //   setIsVisible(false);
  //   process();

  //   if (searchProps.isActive) {
  //     searchProps.onDeactive();
  //   }
  // }, [searchProps.mapSearchWord, searchProps.isActive]);

  return {
    mapAppleSearchList: mapAppleSearchList,
    isFetched: isFetch,
    isVisible: isVisible,
  };
};

export default useAppleMapSearchWithCache;
