import { createCoordinate } from 'components/lib/mapkitjs/utils';
import {
  MAP_EXPLORE_INIT_LATITUDE,
  MAP_EXPLORE_INIT_LONGITUDE,
  MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE,
  MAP_POSITION_ICON_PATH,
  MapExplorePostPopupStateType,
  MAPKIT_CLIENT_MANAGER_KEY,
  POS_CONTROL_GAP_NUM,
} from 'const/MapExploreConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  currentAnnotationAtom,
  geocoderAtom,
  GeoPositionInterface,
  isInitListerAtom,
  selectReverseGeoCodeMapAtom,
} from 'states/MapExploreAtom';
import theme from 'styles/theme';

const MAP_COORINATE_SPAN = 0.06;
let currentAnnotation: mapkit.MarkerAnnotation | null = null;
let currentAnnotationPos: { latitude: number; longitude: number } = {
  latitude: MAP_EXPLORE_INIT_LATITUDE,
  longitude: MAP_EXPLORE_INIT_LONGITUDE,
};
let geocoder: mapkit.Geocoder | null = null;
let init = false;
let selectHandler: (() => void) | null = null;

export interface MoveLocationType {
  latitude: number;
  longitude: number;
  isMoved: boolean;
}

interface MapkitClientManagerProps {
  map: mapkit.Map;
  mapkit: typeof mapkit;
  onSetMapMoveLocation: (moveLocation: MoveLocationType) => void;
  mapExplorePostPopupState: MapExplorePostPopupStateType;
  scrollEndEventFunc: ((e: mapkit.EventBase<mapkit.Map>) => void) | undefined;
}

const MapkitClientManager: React.FC<MapkitClientManagerProps> = ({
  onSetMapMoveLocation,
  map,
  mapkit,
  mapExplorePostPopupState,
  scrollEndEventFunc,
}) => {
  // const currentAnnotationRef = useRef<mapkit.MarkerAnnotation | null>(null);
  // const initRef = useRef(false);
  // const geocoderRef = useRef<mapkit.Geocoder | null>(null);
  // const selectHandlerRef = useRef<((event: any) => void) | null>(null);

  // const mapLocation = useRecoilValue(mapLoactionAtom);

  const setSelectReverseGeoCodeMap = useSetRecoilState(
    selectReverseGeoCodeMapAtom,
  );
  const setCurrentAnnotationTemp = useSetRecoilState(currentAnnotationAtom);
  const setGeocoderTemp = useSetRecoilState(geocoderAtom);

  const { windowWidth } = useWindowSize();

  const setIsInitLister = useSetRecoilState(isInitListerAtom);

  const initTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isListenerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (init) return;
    map.showsCompass = mapkit.FeatureVisibility.Hidden;
    // map.isRotationAvailable = false;
    map.showsMapTypeControl = false;

    geocoder = new mapkit.Geocoder({ language: 'ko-KR' });
    setGeocoderTemp(geocoder);

    // setTimeout(() => {
    //   const posCoordinate = new mapkit.Coordinate(
    //     mapLocation.latitude -
    //       (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 0 : POS_CONTROL_GAP_NUM),
    //     mapLocation.longitude,
    //   );
    //   const markerCoordinate = new mapkit.Coordinate(
    //     mapLocation.latitude,
    //     mapLocation.longitude,
    //   );
    //   map.setCenterAnimated(posCoordinate, false);

    //   const span = new mapkit.CoordinateSpan(coordinateSpan, coordinateSpan);
    //   const region = new mapkit.CoordinateRegion(posCoordinate, span);
    //   map.setRegionAnimated(region, false);

    //   if (currentAnnotation) return;
    //   // selectAnnotationAndGeoCoding(map, mapkit, markerCoordinate);

    //   initRef.current = true;
    // }, 100);

    initTimerRef.current = setTimeout(() => {
      init = true;
    }, 300);
    isListenerTimerRef.current = setTimeout(() => {
      setIsInitLister(true);
    }, 1000);

    return () => {
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
      }
      if (isListenerTimerRef.current) {
        clearTimeout(isListenerTimerRef.current);
      }
    };
  }, [map, mapkit]);

  const deleteAndReturnCurrentAnnotation = async (
    map: globalThis.mapkit.Map,
    mapkit: typeof globalThis.mapkit,
    coordinate: globalThis.mapkit.Coordinate,
  ): Promise<globalThis.mapkit.MarkerAnnotation> => {
    // 기존 주석 삭제

    // if (currentAnnotation) {
    //   if (selectHandlerRef.current) {
    //     currentAnnotation.removeEventListener(
    //       'select',
    //       selectHandlerRef.current,
    //     );
    //   }

    //   map.removeAnnotation(currentAnnotation);
    // }

    // Promise로 이미지 로드 처리
    const loadImage = (src: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      });
    };

    // 이미지 로드 후 새로운 주석 생성
    const glyphImageSrc = await loadImage(MAP_POSITION_ICON_PATH);
    const newAnnotation = new mapkit.MarkerAnnotation(coordinate, {
      color: theme.mainColor.Blue,
      glyphImage: { 1: glyphImageSrc },
    });

    // 새 주석을 지도에 추가
    if (currentAnnotation) {
      if (selectHandler) {
        currentAnnotation.removeEventListener('select', selectHandler);
      }

      map.removeAnnotation(currentAnnotation);
      map.addAnnotation(newAnnotation);
    } else {
      map.addAnnotation(newAnnotation);
    }

    return newAnnotation; // 새 주석 반환
  };

  const selectAnnotationAndGeoCoding = async (
    map: globalThis.mapkit.Map,
    mapkit: typeof globalThis.mapkit,
    coordinate: globalThis.mapkit.Coordinate,
  ) => {
    const newCurrentAnnotation = await deleteAndReturnCurrentAnnotation(
      map,
      mapkit,

      coordinate,
    );

    const handler = () => {
      setSelectReverseGeoCodeMap({
        latitude: newCurrentAnnotation.coordinate.latitude,
        longitude: newCurrentAnnotation.coordinate.longitude,
        isActive: true,
      });
    };
    selectHandler = handler;
    newCurrentAnnotation.addEventListener('select', handler, { passive: true });

    currentAnnotation = newCurrentAnnotation;
    setCurrentAnnotationTemp(currentAnnotation);
  };

  const regionAnimeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapMoveToPosition = async (
    mapLocation: GeoPositionInterface,
    coordinate: mapkit.Coordinate,
  ) => {
    await selectAnnotationAndGeoCoding(map, mapkit, coordinate);

    if (mapLocation && mapLocation.isMoveCenter) {
      const isInit = init;
      const moveFunc = () => {
        const posCoordinate =
          mapExplorePostPopupState === MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE
            ? new mapkit.Coordinate(
                mapLocation.latitude -
                  (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                    ? 0
                    : POS_CONTROL_GAP_NUM),
                mapLocation.longitude,
              )
            : coordinate;

        if (isInit) {
          map.setCenterAnimated(posCoordinate, true);
        }

        const currentLatDelta = map.region.span.latitudeDelta;
        const currentLngDelta = map.region.span.longitudeDelta;

        if (
          currentLatDelta >= MAP_COORINATE_SPAN &&
          currentLngDelta >= MAP_COORINATE_SPAN
        ) {
          const span = new mapkit.CoordinateSpan(
            MAP_COORINATE_SPAN,
            MAP_COORINATE_SPAN,
          );

          const region = new mapkit.CoordinateRegion(posCoordinate, span);

          if (regionAnimeTimerRef.current) {
            clearTimeout(regionAnimeTimerRef.current);
          }
          regionAnimeTimerRef.current = setTimeout(() => {
            map.setRegionAnimated(region, isInit && true);
          }, 500);
        }
      };
      if (init) {
        moveFunc();
      } else {
        if (moveTimerRef.current) {
          clearTimeout(moveTimerRef.current);
        }
        moveTimerRef.current = setTimeout(() => {
          moveFunc();
        }, 100);
      }
    }
  };

  const debounceOnMove = debounce(
    (mapLocation: GeoPositionInterface, coordinate: mapkit.Coordinate) => {
      mapMoveToPosition(mapLocation, coordinate);
    },
    20,
  );

  // useEffect(() => {
  //   if (!mapLocation) return;
  //   const currentPostion = currentAnnotation?.coordinate;

  //   if (
  //     currentPostion &&
  //     currentPostion.latitude === mapLocation.latitude &&
  //     currentPostion.longitude === mapLocation.longitude
  //   ) {
  //     return;
  //   }

  //   const coordinate = createCoordinate(
  //     mapLocation.latitude,
  //     mapLocation.longitude,
  //   );

  //   debounceOnMove(coordinate);
  // }, [mapLocation]);

  const regionChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const funcSingleTap = async (event: any) => {
      const point = event.pointOnPage;
      const coordinate = map.convertPointOnPageToCoordinate(point);
      await selectAnnotationAndGeoCoding(map, mapkit, coordinate);
      onSetMapMoveLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        isMoved: true,
      });
    };

    const eventByRegionChangeEnd = () => {
      if (regionChangeTimerRef.current) {
        clearTimeout(regionChangeTimerRef.current);
      }
      regionChangeTimerRef.current = setTimeout(() => {
        const mapLocationString = localStorage.getItem(
          MAPKIT_CLIENT_MANAGER_KEY,
        );
        if (!mapLocationString) return;
        let mapLocation: GeoPositionInterface | null = null;
        try {
          mapLocation = JSON.parse(mapLocationString);
        } catch (e) {
          return;
        }
        if (!mapLocation) return;
        const currentPostion = currentAnnotation?.coordinate;

        if (
          (currentPostion &&
            currentPostion.latitude === mapLocation.latitude &&
            currentPostion.longitude === mapLocation.longitude) ||
          (currentAnnotationPos.latitude === mapLocation.latitude &&
            currentAnnotationPos.longitude === mapLocation.longitude)
        ) {
          return;
        }

        const coordinate = createCoordinate(
          mapLocation.latitude,
          mapLocation.longitude,
        );

        currentAnnotationPos = {
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude,
        };

        debounceOnMove(mapLocation, coordinate);
      }, 50);
    };

    map.addEventListener('region-change-end', eventByRegionChangeEnd);

    map.addEventListener('single-tap', funcSingleTap, { passive: true });

    if (scrollEndEventFunc) {
      map.addEventListener('scroll-end', scrollEndEventFunc, {
        passive: true,
      });
    }

    return () => {
      if (regionChangeTimerRef.current) {
        clearTimeout(regionChangeTimerRef.current);
      }
      // currentAnnotation이 있다면 이벤트 리스너 제거 후, annotation 제거
      if (currentAnnotation && selectHandler) {
        currentAnnotation.removeEventListener('select', selectHandler);
      }

      map.removeEventListener('single-tap', funcSingleTap);

      if (currentAnnotation) {
        map.removeAnnotation(currentAnnotation);
        // 제거 후, ref를 null로 초기화하여 다음 마운트 시 기존 annotation 참조가 남지 않도록 함
        geocoder = null;
        setGeocoderTemp(geocoder);
      }

      if (scrollEndEventFunc) {
        map.removeEventListener('scroll-end', scrollEndEventFunc);
      }

      map.removeEventListener('region-change-end', eventByRegionChangeEnd);
    };
  }, [map]);

  return null;
};

export default MapkitClientManager;
