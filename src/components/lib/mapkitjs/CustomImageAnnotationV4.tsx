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

export const CustomImageAnnotationV4: React.FC<CustomImageAnnotationProps> = ({
  worker,
  offset,
  selectedSize,
  deselectedSize,
  annotationObjectListRef,
  mapkit,
  map,
}) => {
  const annotationRef = useRef<mapkit.Annotation | null>(null);
  const isClusterListenerSet = useRef(false);

  const setMapClusterPostList = useSetRecoilState(mapClusterPostListInfoAtom);
  const resetMapClusterPostList = useResetRecoilState(
    mapClusterPostListInfoAtom,
  );
  const setIsClickAnnotation = useSetRecoilState(isClickAnnotationAtom);

  const updateAnnotationIconSize = (
    annotation: mapkit.Annotation,
    selected: boolean,
  ) => {
    const img = annotation.element as HTMLImageElement;
    if (!img) return;

    const size = selected ? selectedSize : deselectedSize;
    img.style.animation = selected
      ? 'image-annotation-scale-up-center 0.3s ease both'
      : 'image-annotation-scale-down-center 0.3s ease both';
  };

  const createImageAnnotation = (
    isClusterAnnotation: boolean,
    memberAnnotations: mapkit.Annotation[],
  ): mapkit.Annotation => {
    const annotation = new mapkit.Annotation(
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
        return img;
      },
      {
        size: { width: deselectedSize, height: deselectedSize },
        callout: {
          calloutAnchorOffsetForAnnotation: () => offset,
          calloutAppearanceAnimationForAnnotation: () =>
            '.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein',
        },
        animates: true,
        appearanceAnimation: '',
        clusteringIdentifier: isClusterAnnotation
          ? undefined
          : worker.clusteringIdentifier,
      },
    );

    annotation.data = {
      id: worker.id,
      annotationType: worker,
      isClusterAnnotation,
      annotationPostCluster: isClusterAnnotation
        ? memberAnnotations.map(
            (m) => (m.data as AnnotationInfo).annotationType.snsPost,
          )
        : [worker.snsPost],
    };

    annotation.addEventListener('select', () => {
      updateAnnotationIconSize(annotation, true);
      setIsClickAnnotation(true);

      const data = annotation.data as AnnotationInfo;
      const uniquePosts = new Map<string, PostRsp>();
      data.annotationPostCluster.forEach((p) => uniquePosts.set(p.postId, p));

      setMapClusterPostList({
        isActive: true,
        mapPostList: Array.from(uniquePosts.values()),
      });
    });

    annotation.addEventListener('deselect', () => {
      updateAnnotationIconSize(annotation, false);
      setIsClickAnnotation(false);
      resetMapClusterPostList();
    });

    return annotation;
  };

  useEffect(() => {
    const annotation = createImageAnnotation(false, []);
    annotationRef.current = annotation;
    annotationObjectListRef.current.push(annotation);
    map.addAnnotation(annotation);

    if (!isClusterListenerSet.current && !map.annotationForCluster) {
      isClusterListenerSet.current = true;
      map.annotationForCluster = (cluster) => {
        const members = cluster.memberAnnotations;
        const last = members[members.length - 1];
        const data = last.data as AnnotationInfo;
        return createImageAnnotation(true, members);
      };
    }

    return () => {
      if (annotationRef.current) {
        map.removeAnnotation(annotationRef.current);
        annotationRef.current = null;
      }
      annotationObjectListRef.current = annotationObjectListRef.current.filter(
        (ann) => ann !== annotationRef.current,
      );
    };
  }, []);

  return null;
};
