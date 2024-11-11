import {
  MAP_EXPLORE_INIT_LATITUDE,
  MAP_EXPLORE_INIT_LONGITUDE,
  MAP_EXPLORE_INIT_POSITION,
} from 'const/MapExploreConst';

export interface GeoPositionInterface {
  latitude: number;
  longitude: number;
}

export const initGeoPosition = (): GeoPositionInterface => {
  const geoPosition: GeoPositionInterface = {
    latitude: MAP_EXPLORE_INIT_LATITUDE,
    longitude: MAP_EXPLORE_INIT_LONGITUDE,
  };
  localStorage.setItem(MAP_EXPLORE_INIT_POSITION, JSON.stringify(geoPosition));

  return geoPosition;
};

export const getGeoPosition = (): GeoPositionInterface => {
  const position: GeoPositionInterface = JSON.parse(
    localStorage.getItem(MAP_EXPLORE_INIT_POSITION) ||
      JSON.stringify(initGeoPosition()),
  );
  return position;
};

export const saveInitGeoPosition = (
  geoPosition: GeoPositionInterface,
): void => {
  localStorage.setItem(MAP_EXPLORE_INIT_POSITION, JSON.stringify(geoPosition));
};
