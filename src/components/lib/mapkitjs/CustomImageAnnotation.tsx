import { PostRsp } from 'global/interface/post';
import React, { useEffect, useRef } from 'react';
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

export const CustomImageAnnotation: React.FC<CustomImageAnnotationProps> = ({
  worker,
  offset,
  selectedSize,
  deselectedSize,
  annotationObjectListRef,
  map,
  mapkit,
}) => {
  const annotationRef = useRef<mapkit.Annotation | null>(null);
  const setMapClusterPostList = useSetRecoilState(mapClusterPostListInfoAtom);
  const resetMapClusterPostList = useResetRecoilState(
    mapClusterPostListInfoAtom,
  );

  const setIsClickAnnotation = useSetRecoilState(isClickAnnotationAtom);
  const isClusterListenerSet = useRef(false); // 클러스터 리스너 중복 방지용 ref

  // 🔹 Callout 설정 함수 (어노테이션 클릭 시 보여질 내용)
  const annotationCallout = (worker: AnnotationType) => ({
    calloutElementForAnnotation: (annotation: mapkit.Annotation) => {
      const div = document.createElement('div');
      div.className = 'landmark';

      const title = document.createElement('h1');
      title.textContent = annotation.title;

      div.appendChild(title);
      return div;
    },
    calloutAnchorOffsetForAnnotation: () => offset,
    calloutAppearanceAnimationForAnnotation: () =>
      '.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein',
  });

  const drawTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const createImageAnnotation = (
    mapkit: typeof globalThis.mapkit,
    worker: AnnotationType,
    isClusterAnnotation: boolean,
    isDelay: boolean,
    memberAnnotations: mapkit.Annotation[],
  ) => {
    const annotationObject = new mapkit.Annotation(
      createCoordinate(worker.position.latitude, worker.position.longitude),
      () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const resolutionMultiplier = 2; // 고해상도를 위한 배율
        const size = deselectedSize;
        const canvasSize = size * resolutionMultiplier;

        canvas.width = canvasSize;
        canvas.height = canvasSize;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        canvas.style.borderRadius = '100px';
        canvas.style.border = '2px solid white';
        canvas.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 2px 11px';

        if (!context) return canvas;

        const img = new Image();
        img.src = worker.imageUrl;
        img.onload = () => {
          context.beginPath();
          context.arc(
            canvasSize / 2,
            canvasSize / 2,
            canvasSize / 2,
            0,
            2 * Math.PI,
          );
          context.closePath();
          context.clip();

          drawTimerRef.current = setTimeout(
            () => {
              context.drawImage(img, 0, 0, canvasSize, canvasSize);
            },
            isDelay ? IMAGE_ONLOAD_DELAY_TIME : 0,
          );
        };

        return canvas;
      },
      {
        size: { width: deselectedSize, height: deselectedSize },
        callout: annotationCallout(worker), // ✅ Callout 적용
        animates: true,
        clusteringIdentifier: isClusterAnnotation
          ? 'group'
          : worker.clusteringIdentifier,
      },
    );

    // 🔹 기존 리스너 제거 후 추가
    annotationObject.removeEventListener('select', handleSelect);
    annotationObject.removeEventListener('deselect', handleDeselect);

    annotationObject.addEventListener('select', handleSelect);
    annotationObject.addEventListener('deselect', handleDeselect, {
      passive: true,
    });

    function handleSelect() {
      setIsClickAnnotation(true);
      setMapClusterPostList({
        isActive: true,
        mapPostList: [worker.snsPost], // 중복 방지
      });
    }

    function handleDeselect() {
      setIsClickAnnotation(false);
      resetMapClusterPostList();
    }

    annotationObject.data = {
      id: worker.id,
      annotationType: worker,
      isClusterAnnotation,
      annotationPostCluster: [worker.snsPost],
    };

    return annotationObject;
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

    // 클러스터 리스너가 한 번만 등록되도록 방지
    if (!isClusterListenerSet.current) {
      isClusterListenerSet.current = true;
      map.annotationForCluster = function (cluster) {
        const memberAnnotations = cluster.memberAnnotations;
        const data: AnnotationInfo = memberAnnotations[0].data;

        if (!data.id) return;

        return createImageAnnotation(
          mapkit,
          data.annotationType,
          true,
          true,
          memberAnnotations,
        );
      };
    }

    return () => {
      if (annotationRef.current) {
        try {
          map.removeAnnotation(annotationRef.current);
        } catch (e) {
          console.error('오류로 인해, 어노테이션을 제거하지 못했습니다.');
        }
      }
    };
  }, []);

  return null;
};
