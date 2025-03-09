import React, { useEffect } from 'react';

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

export const CustomImageAnnotation: React.FC<CustomImageAnnotationProps> = ({
  worker,
  offset,
  selectedSize,
  deselectedSize,
  annotationObjectListRef,
  map,
  mapkit,
}) => {
  const annotationRef = React.useRef<mapkit.Annotation>();
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
        return (
          '.4s cubic-bezier(0.4, 0, 0, 1.5) ' + '0s 1 normal scale-and-fadein'
        );
      },
    };
  };

  const updateAnnotationIconSize = (
    annotation: mapkit.Annotation,
    worker: AnnotationType,
  ) => {
    const canvas: HTMLCanvasElement = annotation.element as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      });
    };

    const renderImageToCanvas = (img: HTMLImageElement) => {
      const devicePixelRatio = window.devicePixelRatio || 1; // 디바이스 픽셀 밀도
      const size = deselectedSize;
      const resolutionMultiplier = 2 * devicePixelRatio; // 고해상도 배율
      const canvasSize = size * resolutionMultiplier;

      // 캔버스 초기화
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      context?.clearRect(0, 0, canvas.width, canvas.height);

      // 원형 마스크 만들기
      context?.beginPath();
      context?.arc(
        canvasSize / 2,
        canvasSize / 2,
        canvasSize / 2,
        0,
        2 * Math.PI,
      );
      context?.closePath();
      context?.clip(); // 원형으로 클리핑

      // 이미지 품질 설정
      if (context) {
        context.imageSmoothingEnabled = true; // 이미지 스무딩 활성화
        context.imageSmoothingQuality = 'high'; // 높은 품질
      }

      // 이미지를 고해상도로 그리기
      context?.drawImage(img, 0, 0, canvasSize, canvasSize);

      // 캔버스의 CSS 크기 설정

      // canvas.style.width = `${size}px`;
      // canvas.style.height = `${size}px`;

      canvas.style.borderRadius = '50%';

      // 애니메이션 설정
      canvas.style.animation = annotation.selected
        ? 'image-annotation-scale-up-center 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'
        : 'image-annotation-scale-down-center 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both';
    };

    // 이미지 로드 및 렌더링
    loadImage(worker.imageUrl).then((img) => renderImageToCanvas(img));
  };

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
      const isExisted = distance <= 10;
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
      console.log('5m 이내에 다른 어노테이션이 존재합니다. 생성되지 않습니다.');
      return undefined;
    }

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
        // canvas.style.padding = '2px';
        // canvas.style.backgroundColor = 'white';
        canvas.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 2px 11px';

        if (!context) {
          return canvas;
        }

        const img = new Image();

        img.src = worker.imageUrl;
        img.onload = function () {
          // 원형 마스크 만들기
          context.beginPath();
          context.arc(
            canvasSize / 2,
            canvasSize / 2,
            canvasSize / 2,
            0,
            2 * Math.PI,
          );
          context.closePath();
          context.clip(); // 원형으로 클리핑

          // 50 ms 딜레이를 주어 이미지 흰화면 해결
          if (isDelay) {
            setTimeout(() => {
              context.drawImage(img, 0, 0, canvasSize, canvasSize);
            }, IMAGE_ONLOAD_DELAY_TIME);
          } else {
            context.drawImage(img, 0, 0, canvasSize, canvasSize);
          }

          // 캔버스의 CSS 크기 설정 (화질 유지)
        };

        // Draw the
        return canvas;
      },
      {
        size: {
          width: deselectedSize,
          height: deselectedSize,
        },
        callout: annotationCallout(worker),
        animates: true,
        appearanceAnimation:
          '.4s cubic-bezier(0.4, 0, 0, 1.5) ' + '0s 1 normal scale-and-fadein',
        clusteringIdentifier: isClusterAnnotation
          ? 'group'
          : worker.clusteringIdentifier,
      },
    );
    annotationObject.addEventListener('select', () => {
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
    });
    annotationObject.addEventListener(
      'deselect',
      function () {
        if (!annotationObject) return;
        setIsClickAnnotation(false);

        annotationObject.selected = false;
        // 어노테이션의 아이콘을 갱신하여 크기 변경

        resetMapClusterPostList();
        updateAnnotationIconSize(annotationObject, worker);
      },
      { passive: true },
    );
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
    if (map.annotationForCluster !== null) return;

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
