import React from 'react';

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMapV1 = (defaultOptions: MapOptions = {}) => {
  const [defaultMapOptions] = React.useState(defaultOptions);
  const { mapkit } = React.useContext(MapkitContext);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<mapkit.Map>();

  React.useEffect(() => {
    if (mapkit && mapRef.current) {
      const newMap = new mapkit.Map(
        mapRef.current,
        propsToMapConstructionOptions(defaultMapOptions),
      );

      setMap(newMap);
    }
  }, [mapRef, mapkit]);

  // Clean up the map on unmount
  React.useEffect(() => {
    return () => {
      if (map) {
        console.info('clena map client');

        map.destroy();
      }
    };
  }, [map]);

  return {
    mapkit,
    map,
    mapProps: {
      mapkit,
      map,
      mapRef,
    },
    setRotation: React.useCallback(
      (rotationValue: number, isAnimated = false) => {
        if (map) {
          map.setRotationAnimated(rotationValue, isAnimated);
        }
      },
      [map],
    ),
    setCenter: React.useCallback(
      (centerValue: NumberTuple, isAnimated = false) => {
        if (map) {
          map.setCenterAnimated(createCoordinate(...centerValue), isAnimated);
        }
      },
      [map],
    ),
    setRegion: React.useCallback(
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
    setVisibleMapRect: React.useCallback(
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
