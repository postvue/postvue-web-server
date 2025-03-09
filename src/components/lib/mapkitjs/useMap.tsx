import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { MapkitContext } from './MapkitProvider';
import { MapOptions, propsToMapConstructionOptions } from './utils';

import {
  NumberTuple,
  Rect,
  RegionType,
  createCoordinate,
  createCoordinateRegionFromValues,
  createMapRect,
} from './utils';

// 전역 변수에 map 인스턴스를 저장합니다.
let map: mapkit.Map | undefined = undefined;
let globalMapContainer: HTMLElement | null = null;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMap = (defaultOptions: MapOptions = {}) => {
  const [defaultMapOptions] = useState(defaultOptions);
  const { mapkit } = useContext(MapkitContext);
  const mapRef = useRef<HTMLDivElement>(null);
  // 이미 전역에 map 인스턴스가 있다면 초기 상태로 사용

  useEffect(() => {
    if (mapkit && mapRef.current) {
      if (!map) {
        // 전역에 인스턴스가 없으면 새로 생성하고 저장
        const newMap = new mapkit.Map(
          mapRef.current,
          propsToMapConstructionOptions(defaultMapOptions),
        );
        map = newMap;
      } else {
        // 이미 생성된 인스턴스가 있으면 그대로 사용
        if (globalMapContainer !== mapRef.current) {
          // 전역 인스턴스의 map 엘리먼트를 새 컨테이너로 이동합니다.
          // (map.element는 내부적으로 map이 사용하는 DOM 엘리먼트를 의미합니다.)
          if (map.element) {
            // 기존 컨테이너에서 제거
            if (
              globalMapContainer &&
              globalMapContainer.contains(map.element)
            ) {
              globalMapContainer.removeChild(map.element);
            }
            // 새 컨테이너에 추가
            mapRef.current.appendChild(map.element);
          }
          // 전역 컨테이너 정보를 업데이트합니다.
          globalMapContainer = mapRef.current;
        }
      }
    }
  }, [mapRef, mapkit, defaultMapOptions]);

  // Clean up the map on unmount
  // useEffect(() => {
  //   return () => {
  //     if (map) {
  //       // map.removeAnnotations(map.annotations);
  //       // map.destroy();
  //     }
  //   };
  // }, [map]);

  // useEffect(() => {
  //   return () => {
  //     // if (map) {
  //     //   map.destroy();
  //     // }
  //   };
  // }, []);

  return {
    mapkit,
    map,
    mapProps: {
      mapkit,
      map,
      mapRef,
    },
    setRotation: useCallback(
      (rotationValue: number, isAnimated = false) => {
        if (map) {
          map.setRotationAnimated(rotationValue, isAnimated);
        }
      },
      [map],
    ),
    setCenter: useCallback(
      (centerValue: NumberTuple, isAnimated = false) => {
        if (map) {
          map.setCenterAnimated(createCoordinate(...centerValue), isAnimated);
        }
      },
      [map],
    ),
    setRegion: useCallback(
      (region: RegionType, isAnimated = false) => {
        if (map) {
          map.setRegionAnimated(
            createCoordinateRegionFromValues(region),
            isAnimated,
          );
        }
      },
      [map],
    ),
    setVisibleMapRect: useCallback(
      (visibleMapRect: Rect, isAnimated = false) => {
        if (map) {
          map.setVisibleMapRectAnimated(
            createMapRect(...visibleMapRect),
            isAnimated,
          );
        }
      },
      [map],
    ),
  };
};
