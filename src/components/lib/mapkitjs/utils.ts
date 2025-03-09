/* global mapkit */

// Typescript Helpers
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
type ConstructorParameters<T> = T extends new (...args: infer U) => any
  ? U
  : never;

type MapConstructionOptions = NonNullable<
  ConstructorParameters<typeof mapkit.Map>[1]
>;

type MarkerConstructionOptions = NonNullable<
  ConstructorParameters<typeof mapkit.MarkerAnnotation>[1]
>;

type PaddingConstructorOptions = NonNullable<
  ConstructorParameters<typeof mapkit.Padding>[0]
>;

export type NumberTuple = [number, number];
export type Rect = [number, number, number, number];
export type PaddingType = number | PaddingConstructorOptions;
export type RegionType = {
  latitude: number;
  longitude: number;
  latitudeSpan: number;
  longitudeSpan: number;
};
export type ImageUrl = {
  '1': string;
  '2'?: string;
  '3'?: string;
};

// Mapkit helpers

export const createPadding = (padding: PaddingType): mapkit.Padding => {
  return new mapkit.Padding(
    typeof padding === 'number'
      ? {
          top: padding,
          right: padding,
          bottom: padding,
          left: padding,
        }
      : padding,
  );
};

export const createCoordinate = (
  latitude: number,
  longitude: number,
): mapkit.Coordinate => {
  return new mapkit.Coordinate(latitude, longitude);
};

export const createCoordinateSpan = (
  latitudeDelta: number,
  longitudeDelta: number,
): mapkit.CoordinateSpan => {
  return new mapkit.CoordinateSpan(latitudeDelta, longitudeDelta);
};

export const createCoordinateRegionFromValues = (
  region: RegionType,
): mapkit.CoordinateRegion => {
  return createCoordinateRegion(
    createCoordinate(region.latitude, region.longitude),
    createCoordinateSpan(region.latitudeSpan, region.longitudeSpan),
  );
};

export const createCoordinateRegion = (
  center: mapkit.Coordinate,
  span: mapkit.CoordinateSpan,
): mapkit.CoordinateRegion => {
  return new mapkit.CoordinateRegion(center, span);
};

export const createMapPoint = (x: number, y: number): mapkit.MapPoint => {
  return new mapkit.MapPoint(x, y);
};

export const createMapRect = (
  x: number,
  y: number,
  width: number,
  height: number,
): mapkit.MapRect => {
  return new mapkit.MapRect(x, y, width, height);
};

// 🗺️ Map Options

// these are the props we expose to users.
export type MapOptions = Merge<
  MapConstructionOptions,
  {
    visibleMapRect?: Rect;
    region?: RegionType;
    center?: NumberTuple;
    padding?: PaddingType;
  }
>;

// this function takes simple props and turns them into the mapkit options that mapkit expects

interface propsToMapConstructionOptionsType {
  visibleMapRect: mapkit.MapRect | undefined;
  region: mapkit.CoordinateRegion | undefined;
  center: mapkit.Coordinate | undefined;
  padding: mapkit.Padding;
}

export const propsToMapConstructionOptions = ({
  visibleMapRect,
  region,
  center,
  padding,
  ...options
}: MapOptions): propsToMapConstructionOptionsType => ({
  visibleMapRect: visibleMapRect && createMapRect(...visibleMapRect),
  region: region && createCoordinateRegionFromValues(region),
  center: center && createCoordinate(...center),
  padding: padding ? createPadding(padding) : createPadding(0),
  ...options,
});

// 📌 Marker Options

// these are the props we expose to users.
export type MarkerOptions = Merge<
  MarkerConstructionOptions,
  {
    padding?: PaddingType;
  }
>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const propsToMarkerConstructionOptions = ({
  padding,
  ...options
}: MarkerOptions) => {
  return {
    padding: padding ? createPadding(padding) : createPadding(0),
    ...options,
  };
};
