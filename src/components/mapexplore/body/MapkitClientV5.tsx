import { AnnotationType } from 'components/lib/mapkitjs/CustomImageAnnotationV1';
import { CustomImageAnnotationV3 } from 'components/lib/mapkitjs/CustomImageAnnotationV3';
import { Map } from 'components/lib/mapkitjs/Map';
import { useMap } from 'components/lib/mapkitjs/useMap';
import { createCoordinate } from 'components/lib/mapkitjs/utils';
import {
  MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE,
  MAPKIT_CLIENT_MANAGER_KEY,
  POS_CONTROL_GAP_NUM,
} from 'const/MapExploreConst';
import { POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { isValidString } from 'global/util/ValidUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMapAddressByGeo } from 'hook/queryhook/QueryStateMapAddressByGeo';
import { PostMapPostInfiniteInterface } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentAnnotationAtom,
  geocoderAtom,
  isInitListerAtom,
  mapExplorePostPopupStateAtom,
  mapLoactionAtom,
  selectReverseGeoCodeMapAtom,
} from 'states/MapExploreAtom';
import MapkitClientManager from './MapkitClientManager';

// 거리 계산 유틸
const calculateDistanceInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
  scrollEndEventFunc: (e: mapkit.EventBase<mapkit.Map>) => void;
  onSetMapMoveLocation: (moveLocation: MoveLocationType) => void;
  coordinateSpan?: number;
}

const MapkitClientV5: React.FC<MapkitClientProps> = ({
  mapPost,
  onSetMapMoveLocation,
  scrollEndEventFunc,
  coordinateSpan = 0.06,
}) => {
  const mapLocation = useRecoilValue(mapLoactionAtom);
  const { map, mapProps, mapkit } = useMap();
  const isInitLister = useRecoilValue(isInitListerAtom);

  const annotationObjectList = useRef<mapkit.Annotation[]>([]);
  const [postMarkerList, setPostMarkerList] = useState<AnnotationType[]>([]);
  const [initImageAnnotation, setInitImageAnnotation] =
    useState<boolean>(false);

  const [selectReverseGeoCodeMap, setSelectReverseGeoCodeMap] = useRecoilState(
    selectReverseGeoCodeMapAtom,
  );

  const { windowWidth } = useWindowSize();
  const { data: mapAddress, isFetched: isFetchedByMapAddress } =
    QueryStateMapAddressByGeo(
      selectReverseGeoCodeMap.latitude,
      selectReverseGeoCodeMap.longitude,
      selectReverseGeoCodeMap.isActive,
    );

  const mapExplorePostPopupState = useRecoilValue(mapExplorePostPopupStateAtom);

  useEffect(() => {
    if (!mapPost || !map) return;

    annotationObjectList.current = [];

    const newMapPost: AnnotationType[] = mapPost.pages
      .flatMap((v) => v)
      .map((v, i) => {
        const firstPostContent = v.postContents[0];
        return {
          id: i + mapLocation.latitude + mapLocation.longitude + v.postId,
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

  const mapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!map || !mapkit) return;
    mapTimerRef.current = setTimeout(
      () => {
        const coordinate = createCoordinate(
          mapLocation.latitude,
          mapLocation.longitude,
        );

        if (mapLocation.isMoveCenter) {
          const posCoordinate =
            mapExplorePostPopupState ===
            MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE
              ? new mapkit.Coordinate(
                  mapLocation.latitude -
                    (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                      ? 0
                      : POS_CONTROL_GAP_NUM),
                  mapLocation.longitude,
                )
              : coordinate;

          map.setCenterAnimated(posCoordinate, initImageAnnotation && true);

          const currentLatDelta = map.region.span.latitudeDelta;
          const currentLngDelta = map.region.span.longitudeDelta;

          let timerId: NodeJS.Timeout;
          if (
            currentLatDelta >= coordinateSpan &&
            currentLngDelta >= coordinateSpan
          ) {
            const span = new mapkit.CoordinateSpan(
              coordinateSpan,
              coordinateSpan,
            );

            const region = new mapkit.CoordinateRegion(posCoordinate, span);
            timerId = setTimeout(() => {
              map.setRegionAnimated(region, initImageAnnotation && true);
            }, 500);
          }

          return () => {
            if (timerId) clearTimeout(timerId);
          };
        }

        localStorage.setItem(
          MAPKIT_CLIENT_MANAGER_KEY,
          JSON.stringify(mapLocation),
        );
      },
      isInitLister ? 700 : 1000,
    );

    return () => {
      if (mapTimerRef.current) {
        clearTimeout(mapTimerRef.current);
      }
    };
  }, [map, mapLocation]);

  const initImageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setSelectReverseGeoCodeMap({
      latitude: mapLocation.latitude,
      longitude: mapLocation.longitude,
      isActive: false,
    });
    initImageTimerRef.current = setTimeout(() => {
      setInitImageAnnotation(true);
    }, 1000);

    return () => {
      if (initImageTimerRef.current) {
        clearTimeout(initImageTimerRef.current);
      }
      setInitImageAnnotation(false);
    };
  }, []);

  const currentAnnotation = useRecoilValue(currentAnnotationAtom);
  const geocoder = useRecoilValue(geocoderAtom);

  useEffect(() => {
    if (
      !isFetchedByMapAddress ||
      !currentAnnotation ||
      !selectReverseGeoCodeMap.isActive
    ) {
      return;
    }

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

    setSelectReverseGeoCodeMap((prev) => ({ ...prev, isActive: false }));
  }, [isFetchedByMapAddress, selectReverseGeoCodeMap]);

  return (
    <>
      <Map {...mapProps} />
      {map && mapkit && !isInitLister && (
        <MapkitClientManager
          map={map}
          mapkit={mapkit}
          onSetMapMoveLocation={onSetMapMoveLocation}
          mapExplorePostPopupState={mapExplorePostPopupState}
          scrollEndEventFunc={scrollEndEventFunc}
        />
      )}

      {map &&
        mapkit &&
        initImageAnnotation &&
        (() => {
          const clusterTargets = new Set<string>();

          for (let i = 0; i < postMarkerList.length; i++) {
            for (let j = i + 1; j < postMarkerList.length; j++) {
              const a = postMarkerList[i];
              const b = postMarkerList[j];
              const dist = calculateDistanceInMeters(
                a.position.latitude,
                a.position.longitude,
                b.position.latitude,
                b.position.longitude,
              );
              if (dist <= 15) {
                clusterTargets.add(a.id);
                clusterTargets.add(b.id);
              }
            }
          }

          return postMarkerList
            .filter((worker) => !clusterTargets.has(worker.id))
            .map((worker) => (
              <CustomImageAnnotationV3
                key={worker.id}
                offset={offset}
                selectedSize={selectedSize}
                deselectedSize={deselectedSize}
                worker={worker}
                annotationObjectListRef={annotationObjectList}
                map={map}
                mapkit={mapkit}
              />
            ));
        })()}
    </>
  );
};

export default MapkitClientV5;
