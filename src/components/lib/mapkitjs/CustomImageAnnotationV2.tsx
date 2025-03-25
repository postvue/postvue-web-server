import React, { useEffect, useRef } from 'react';

import { PostRsp } from 'global/interface/post';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import {
  isClickAnnotationAtom,
  mapClusterPostListInfoAtom,
} from 'states/MapExploreAtom';
import { MarkerOptions, createCoordinate } from './utils';

export interface AnnotationPosType {
  latitude: number;
  longitude: number;
}

export interface AnnotationType {
  id: string;
  position: AnnotationPosType;
  title: string;
  imageUrl: string;
  clusteringIdentifier: string;
  snsPost: PostRsp;
}

export interface AnnotationInfo {
  id: string;
  annotationType: AnnotationType;
  isClusterAnnotation: boolean;
  annotationPostCluster: PostRsp[];
}

type CustomImageAnnotationProps = {
  worker: AnnotationType;
  offset: DOMPoint;
  selectedSize: number;
  deselectedSize: number;
  annotationObjectListRef: React.MutableRefObject<mapkit.Annotation[]>;
  mapkit: typeof mapkit;
  map: mapkit.Map;
} & MarkerOptions;

const IMAGE_ONLOAD_DELAY_TIME = 75;

export const CustomImageAnnotationV2: React.FC<CustomImageAnnotationProps> = ({
  worker,
  offset,
  selectedSize,
  deselectedSize,
  annotationObjectListRef,
  map,
  mapkit,
}) => {
  const annotationRef = React.useRef<mapkit.Annotation>();
  const isClusterListenerSet = useRef(false);
  const setMapClusterPostList = useSetRecoilState(mapClusterPostListInfoAtom);
  const resetMapClusterPostList = useResetRecoilState(
    mapClusterPostListInfoAtom,
  );

  const setIsClickAnnotation = useSetRecoilState(isClickAnnotationAtom);

  const annotationCallout = (worker: AnnotationType) => {
    return {
      calloutElementForAnnotation: (annotation: mapkit.Annotation) => {
        // updateAnnotationIconSize(annotation, worker);

        const div = document.createElement('div');
        div.className = 'landmark';

        const title = div.appendChild(document.createElement('h1'));
        title.textContent = annotation.title;

        div.appendChild(title);

        return div;
      },

      calloutAnchorOffsetForAnnotation: (annotation: any, element: any) =>
        offset,

      calloutAppearanceAnimationForAnnotation: (annotation: any) => {
        return '';
      },
    };
  };

  const updateAnnotationIconSize = (
    annotation: mapkit.Annotation,
    worker: AnnotationType,
  ) => {
    const img = annotation.element as HTMLImageElement;

    if (!img) return;

    const size = annotation.selected ? selectedSize : deselectedSize;

    // 크기 조절
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;

    // 애니메이션 스타일 적용
    img.style.animation = annotation.selected
      ? 'image-annotation-scale-up-center 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'
      : 'image-annotation-scale-down-center 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both';
  };

  const drawTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSelectRef = useRef<(() => void) | null>(null);
  const onDeselectRef = useRef<(() => void) | null>(null);

  const createImageAnnotation = (
    mapkit: typeof globalThis.mapkit,
    worker: AnnotationType,
    isClusterAnnotation: boolean,
    isDelay: boolean,
    memberAnnotations: mapkit.Annotation[],
  ) => {
    // 기존 어노테이션과의 거리 검사
    const existingAnnotations = annotationObjectListRef.current;
    const isWithinDistance = existingAnnotations.some((annotation) => {
      const existingData: AnnotationInfo = annotation.data;
      const distance = calculateDistance(
        worker.position,
        existingData.annotationType.position,
      );
      const isExisted = distance <= 15;
      if (isExisted) {
        const annotaionInfo: AnnotationInfo = annotation.data;
        annotation.data = {
          ...annotaionInfo,
          annotationPostCluster: [
            ...annotaionInfo.annotationPostCluster,
            worker.snsPost,
          ],
        };
      }
      return isExisted;
    });

    if (isWithinDistance && !isClusterAnnotation) {
      console.log(
        '10m 이내에 다른 어노테이션이 존재합니다. 생성되지 않습니다.',
      );
      return undefined;
    }

    const annotationObject = new mapkit.Annotation(
      createCoordinate(worker.position.latitude, worker.position.longitude),
      () => {
        const img = document.createElement('img');

        img.src = worker.imageUrl;
        img.style.width = `${deselectedSize}px`;
        img.style.height = `${deselectedSize}px`;
        img.style.borderRadius = '100px';
        img.style.border = '2px solid white';
        img.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 2px 11px';
        img.style.objectFit = 'cover';
        img.loading = 'lazy'; // 힌트용 (iOS 일부 버전은 무시할 수 있음)

        return img;
      },
      {
        size: {
          width: deselectedSize,
          height: deselectedSize,
        },
        callout: annotationCallout(worker),
        animates: true,
        appearanceAnimation: '', // 애니메이션 제거 → 튕김 예방
        clusteringIdentifier: isClusterAnnotation
          ? 'group'
          : worker.clusteringIdentifier,
      },
    );

    const onSelect = () => {
      updateAnnotationIconSize(annotationObject, worker);
      setIsClickAnnotation(true);

      const annotaionInfo: AnnotationInfo = annotationObject.data;

      const uniquePosts = new Map<string, PostRsp>();

      annotaionInfo.annotationPostCluster.forEach((post) => {
        uniquePosts.set(post.postId, post); // 같은 postId가 있으면 덮어쓰기
      });

      setMapClusterPostList({
        isActive: true,
        mapPostList: Array.from(uniquePosts.values()),
      });
    };

    if (onSelectRef.current) {
      annotationObject.removeEventListener('select', onSelect);
    }
    onSelectRef.current = onSelect;

    const onDeselect = function () {
      if (!annotationObject) return;
      setIsClickAnnotation(false);

      annotationObject.selected = false;
      // 어노테이션의 아이콘을 갱신하여 크기 변경

      resetMapClusterPostList();
      updateAnnotationIconSize(annotationObject, worker);
    };

    if (onDeselectRef.current) {
      annotationObject.removeEventListener('select', onDeselect);
    }
    onDeselectRef.current = onDeselect;

    annotationObject.addEventListener('select', onSelect);
    annotationObject.addEventListener('deselect', onDeselect, {
      passive: true,
    });

    const annotaionInfo: AnnotationInfo = {
      id: worker.id,
      annotationType: worker,
      isClusterAnnotation: isClusterAnnotation,
      annotationPostCluster: isClusterAnnotation
        ? memberAnnotations.map((v) => {
            const annotationType: AnnotationInfo = v.data;
            return annotationType.annotationType.snsPost;
          })
        : [worker.snsPost],
    };
    annotationObject.data = annotaionInfo;

    return annotationObject;
  };

  const calculateDistance = (
    pos1: AnnotationPosType,
    pos2: AnnotationPosType,
  ) => {
    const R = 6371000; // 지구 반지름 (미터)
    const toRad = (value: number) => (value * Math.PI) / 180;

    const lat1 = toRad(pos1.latitude);
    const lon1 = toRad(pos1.longitude);
    const lat2 = toRad(pos2.latitude);
    const lon2 = toRad(pos2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 두 점 사이의 거리 (미터)
  };

  useEffect(() => {
    const annotationObject = createImageAnnotation(
      mapkit,
      worker,
      false,
      true,
      [],
    );

    annotationRef.current = annotationObject;
    if (!annotationObject) return;

    annotationObjectListRef.current.push(annotationObject);
    map.addAnnotation(annotationObject);

    // 클러스터;
    if (isClusterListenerSet.current || map.annotationForCluster !== null)
      return;
    isClusterListenerSet.current = true;

    map.annotationForCluster = function (cluster) {
      // 클러스터를 구성하는 어노테이션 수

      const memberAnnotations = cluster.memberAnnotations;

      const index = memberAnnotations.length - 1;

      const data: AnnotationInfo = memberAnnotations[index].data;

      if (!data.id) return;

      const annotation = createImageAnnotation(
        mapkit,
        data.annotationType,
        true,
        true,
        memberAnnotations,
      );

      return annotation;
    };

    return () => {
      if (drawTimerRef.current) {
        clearTimeout(drawTimerRef.current);
      }
      if (annotationObject) {
        if (onSelectRef.current) {
          annotationObject.removeEventListener('select', onSelectRef.current);
        }
        if (onDeselectRef.current) {
          annotationObject.removeEventListener(
            'deselect',
            onDeselectRef.current,
          );
        }
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (annotationRef.current && map) {
        try {
          map.removeAnnotation(annotationRef.current);
        } catch (e) {
          console.error('오류로 인해, 이미지를 생성하지 못했습니다.');
        }
      }
    };
  }, [map]);

  return null;
};
