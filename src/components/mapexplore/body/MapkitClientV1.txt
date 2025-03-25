import {
  AnnotationType,
  CustomImageAnnotationV1,
} from 'components/lib/mapkitjs/CustomImageAnnotationV1';
import { Map } from 'components/lib/mapkitjs/Map';
import { useMapV1 } from 'components/lib/mapkitjs/useMapV1';
import { createCoordinate } from 'components/lib/mapkitjs/utils';
import {
  MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE,
  POS_CONTROL_GAP_NUM,
} from 'const/MapExploreConst';
import { POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { isValidString } from 'global/util/ValidUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMapAddressByGeo } from 'hook/queryhook/QueryStateMapAddressByGeo';
import { PostMapPostInfiniteInterface } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  GeoPositionInterface,
  mapExplorePostPopupStateAtom,
} from 'states/MapExploreAtom';
import theme from 'styles/theme';

let currentAnnotation: mapkit.MarkerAnnotation | null = null;
let geocoder: mapkit.Geocoder | null = null;
let init = false;
const MAP_COORINATE_SPAN = 0.06;

const offset = new DOMPoint(5, -80);

const selectedSize = 70;
const deselectedSize = 40;

export interface MoveLocationType {
  latitude: number;
  longitude: number;
  isMoved: boolean;
}

interface MapkitClientProps {
  mapPost: PostMapPostInfiniteInterface | undefined;
  mapLocation: GeoPositionInterface;
  scrollEndEventFunc?: (e: mapkit.EventBase<mapkit.Map>) => void;
  isRefresh: boolean;
  onSetMapMoveLocation: (moveLocation: MoveLocationType) => void;
  coordinateSpan?: number;
}

const MapkitClientV1: React.FC<MapkitClientProps> = ({
  mapPost,
  mapLocation,
  onSetMapMoveLocation,
  scrollEndEventFunc,
  isRefresh,
  coordinateSpan = 0.05,
}) => {
  const { map, mapProps, mapkit } = useMapV1();

  const annotationObjectList = useRef<mapkit.Annotation[]>([]);
  const [postMarkerList, setPostMarkerList] = useState<AnnotationType[]>([]);

  const [activeMapPos, setActiveMap] = useState<{
    latitude: number;
    longitude: number;
    isActive: boolean;
  }>({
    latitude: mapLocation.latitude,
    longitude: mapLocation.longitude,
    isActive: false,
  });

  const { windowWidth } = useWindowSize();
  const { data: mapAddress, isFetched: isFetchedByMapAddress } =
    QueryStateMapAddressByGeo(activeMapPos.latitude, activeMapPos.longitude);

  const [mapExplorePostPopupState, setMapExplorePostPopupState] =
    useRecoilState(mapExplorePostPopupStateAtom);

  useEffect(() => {
    if (!mapPost || !map) return;

    if (isRefresh) {
      annotationObjectList.current.forEach((annotationObject) => {
        map.removeAnnotation(annotationObject);
      });

      annotationObjectList.current = [];
    }

    const newMapPost: AnnotationType[] = mapPost.pages
      .flatMap((v) => v)
      .map((v, i) => {
        const firstPostContent = v.postContents[0];
        return {
          id: i + mapLocation.latitude + mapLocation.latitude + v.postId,
          position: {
            latitude: v.location.latitude,
            longitude: v.location.longitude,
          },
          title: v.location.address,
          imageUrl:
            firstPostContent.postContentType === POST_VIDEO_TYPE
              ? firstPostContent.previewImg
              : firstPostContent.content,
          clusteringIdentifier: 'target',
          snsPost: v,
        };
      });

    setPostMarkerList(newMapPost);
  }, [mapPost, map]);

  const deleteAndReturnCurrentAnnotation = async (
    map: globalThis.mapkit.Map,
    mapkit: typeof globalThis.mapkit,
    currentAnnotation: globalThis.mapkit.MarkerAnnotation | null,
    coordinate: globalThis.mapkit.Coordinate,
  ): Promise<globalThis.mapkit.MarkerAnnotation> => {
    // 기존 주석 삭제
    if (currentAnnotation) {
      map.removeAnnotation(currentAnnotation);
    }

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
    const glyphImageSrc = await loadImage(
      '/assets/images/icon/svg/MapPositionIcon.svg',
    );
    const newAnnotation = new mapkit.MarkerAnnotation(coordinate, {
      color: theme.mainColor.Blue,
      glyphImage: { 1: glyphImageSrc },
    });

    // 새 주석을 지도에 추가
    map.addAnnotation(newAnnotation);

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
      currentAnnotation,
      coordinate,
    );

    newCurrentAnnotation.addEventListener(
      'select',
      () => {
        setActiveMap({
          latitude: newCurrentAnnotation.coordinate.latitude,
          longitude: newCurrentAnnotation.coordinate.longitude,
          isActive: true,
        });
      },
      { passive: true },
    );

    currentAnnotation = newCurrentAnnotation;
    // map.addAnnotation(currentAnnotation);
  };

  useEffect(() => {
    if (!map || !mapkit || init) return;

    map.showsCompass = mapkit.FeatureVisibility.Hidden;
    // map.isRotationAvailable = false;
    map.showsMapTypeControl = false;

    if (scrollEndEventFunc) {
      map.addEventListener('scroll-end', scrollEndEventFunc, { passive: true });
    }

    const funcSigleTap = (event: any) => {
      const point = event.pointOnPage;
      const coordinate = map.convertPointOnPageToCoordinate(point);
      selectAnnotationAndGeoCoding(map, mapkit, coordinate);
      onSetMapMoveLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        isMoved: true,
      });
    };

    map.addEventListener('single-tap', funcSigleTap, { passive: true });

    const posCoordinate = new mapkit.Coordinate(
      mapLocation.latitude -
        (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 0 : POS_CONTROL_GAP_NUM),
      mapLocation.longitude,
    );
    const markerCoordinate = new mapkit.Coordinate(
      mapLocation.latitude,
      mapLocation.longitude,
    );
    map.setCenterAnimated(posCoordinate, false);

    const span = new mapkit.CoordinateSpan(coordinateSpan, coordinateSpan);
    const region = new mapkit.CoordinateRegion(posCoordinate, span);
    map.setRegionAnimated(region, false);

    selectAnnotationAndGeoCoding(map, mapkit, markerCoordinate);

    init = true;

    geocoder = new mapkit.Geocoder({ language: 'ko-KR' });

    return () => {
      if (scrollEndEventFunc) {
        map.removeEventListener('scroll-end', scrollEndEventFunc);
      }

      map.removeEventListener('single-tap', funcSigleTap);

      init = false;
    };
  }, [map, mapkit]);

  useEffect(() => {
    if (!map || !mapkit) return;

    const coordinate = createCoordinate(
      mapLocation.latitude,
      mapLocation.longitude,
    );

    selectAnnotationAndGeoCoding(map, mapkit, coordinate);

    if (mapLocation.isMoveCenter) {
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
      map.setCenterAnimated(posCoordinate, true);

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
        setTimeout(() => {
          map.setRegionAnimated(region, true);
        }, 500);
      }
    }
  }, [mapLocation]);

  useEffect(() => {
    if (!isFetchedByMapAddress || !currentAnnotation || !activeMapPos.isActive)
      return;

    if (!mapAddress || (mapAddress && !isValidString(mapAddress.address))) {
      if (!geocoder) return;

      geocoder.reverseLookup(currentAnnotation.coordinate, (error, data) => {
        const first = !error && data.results ? data.results[0] : null;
        if (!currentAnnotation) return;
        currentAnnotation.title = (first && first.name) || '';
      });
    } else {
      currentAnnotation.title = mapAddress.address;
    }

    setActiveMap((prev) => ({ ...prev, isActive: false }));
  }, [isFetchedByMapAddress, activeMapPos.isActive]);

  return (
    <>
      <Map {...mapProps} />
      {map &&
        mapkit &&
        postMarkerList.map((worker, i) => {
          return (
            <CustomImageAnnotationV1
              key={worker.id}
              offset={offset}
              selectedSize={selectedSize}
              deselectedSize={deselectedSize}
              worker={worker}
              annotationObjectListRef={annotationObjectList}
              map={map}
              mapkit={mapkit}
            />
          );
        })}
    </>
  );
};

export default MapkitClientV1;
