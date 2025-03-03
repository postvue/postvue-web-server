import React from 'react';

import { MapContext } from './Map';

import {
  MarkerOptions,
  createCoordinate,
  propsToMarkerConstructionOptions,
} from './utils';

type MarkerProps = {
  latitude: number;
  longitude: number;
  setCurrentAnnotation?: React.Dispatch<
    React.SetStateAction<mapkit.Annotation | null>
  >;
} & MarkerOptions;

export const Marker: React.FC<MarkerProps> = ({
  latitude,
  longitude,
  setCurrentAnnotation,
  ...options
}) => {
  const { mapkit, map } = React.useContext(MapContext);
  const marker = React.useRef<mapkit.MarkerAnnotation>();

  React.useEffect(() => {
    if (mapkit && map) {
      marker.current = new mapkit.MarkerAnnotation(
        createCoordinate(latitude, longitude),
        propsToMarkerConstructionOptions(options),
      );

      map.addAnnotation(marker.current);
      if (setCurrentAnnotation) {
        setCurrentAnnotation(marker.current);
      }
    }
    return () => {
      marker.current && map && map.removeAnnotation(marker.current);
      if (setCurrentAnnotation) {
        setCurrentAnnotation(null);
      }
    };
  }, [mapkit, map]);

  return null;
};
