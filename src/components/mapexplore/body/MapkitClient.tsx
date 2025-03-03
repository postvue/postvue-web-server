import { CustomImageAnnotation } from 'components/lib/mapkitjs/CustomImageAnnotation';
import { AnnotationType } from 'components/lib/mapkitjs/CustomImageAnnotationV1';
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

// @REFER: 수정 필요
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

const MapkitClient: React.FC<MapkitClientProps> = ({
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

    // if (isRefresh) {
    //   annotationObjectList.current.forEach((annotationObject) => {
    //     map.removeAnnotation(annotationObject);
    //   });
    // }
    annotationObjectList.current = [];

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

  useEffect(() => {
    if (!map || !mapkit) return;
    setTimeout(
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
  }, [map, mapLocation]);

  useEffect(() => {
    setSelectReverseGeoCodeMap({
      latitude: mapLocation.latitude,
      longitude: mapLocation.longitude,
      isActive: false,
    });
    setTimeout(() => {
      setInitImageAnnotation(true);
    }, 1000);

    return () => {
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
        postMarkerList.map((worker) => {
          return (
            <CustomImageAnnotation
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

export default MapkitClient;
