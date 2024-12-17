import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface PostVideoPreviewELementProps {
  postId: string;
  activeVideoId: string | null;
  autoPlayMode?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onLoadedData?: React.ReactEventHandler<HTMLVideoElement>;
  videoSrc: string;
  posterImg: string;
  PostVideoStyle?: React.CSSProperties;
  isVisibilityDetection?: boolean;
  visibilityThreshold?: number;
  actionFuncByRef?:
    | ((value: HTMLImageElement | HTMLVideoElement) => void)
    | undefined;
  onError: () => void;
}

const PostVideoPreviewElement: React.FC<PostVideoPreviewELementProps> = ({
  postId,
  activeVideoId,
  autoPlayMode = true,
  onPlay,
  onPause,
  onLoadedData,
  videoSrc,
  posterImg,
  PostVideoStyle,
  isVisibilityDetection = false,
  visibilityThreshold = 0.7,
  actionFuncByRef,
  onError,
}) => {
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const autoPlayRef = useRef<boolean>(false);

  useEffect(() => {
    autoPlayRef.current = autoPlayMode;
    console.log(autoPlayRef.current);
  }, [autoPlayMode]);

  const handleVisibility = useCallback(() => {
    const video = previewVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (
          entry.isIntersecting &&
          (activeVideoId === null || activeVideoId === postId) &&
          autoPlayRef.current
        ) {
          // await new Promise<void>((resolve) => {
          //   video.addEventListener('loadeddata', () => {
          //     console.log('피피피');
          //     resolve();
          //   });
          // });

          if (video.paused) {
            console.log('이것 보랄?');
            video.play().catch(() => {
              ('');
            });
          }
        } else {
          if (video.paused) return;
          console.log('멈춰');
          video.pause();
        }
      },
      { threshold: visibilityThreshold },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, [visibilityThreshold, activeVideoId]);

  // @REFER: 잠깐 주석 처리
  // useEffect(() => {
  //   if (isVisibilityDetection) {
  //     const cleanup = handleVisibility(); // visibility detection 핸들러 실행
  //     return cleanup; // 컴포넌트 unmount 시 observer 해제
  //   }
  // }, [isVisibilityDetection, handleVisibility]); // 의존성 배열로 최적화

  const [isError, setIsError] = useState(false);

  return (
    <div
      style={{
        ...{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
        },
      }}
    >
      {!isError && (
        <PostVideoPreviewImg
          src={posterImg}
          onError={() => {
            setIsError(true);
          }}
        />
      )}
      <PostContentVideoWrap style={PostVideoStyle}>
        <PostContentVideo
          width={'100%'}
          height={'100%'}
          autoPlay={false}
          muted
          preload="none"
          playsInline
          onLoadedData={onLoadedData}
          ref={previewVideoRef}
          poster={posterImg}
          onPlay={onPlay}
          onPause={onPause}
          onClick={() => {
            if (!actionFuncByRef || !previewVideoRef.current) return;
            actionFuncByRef(previewVideoRef.current);
          }}
          onError={() => {
            onError();
          }}
          style={PostVideoStyle}
        >
          <source src={videoSrc} />
        </PostContentVideo>
      </PostContentVideoWrap>
    </div>
  );
};

const PostContentVideoWrap = styled.div`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  vertical-align: bottom;
  z-index: 5;
  position: relative;
`;

const PostContentVideo = styled.video`
  vertical-align: bottom;
`;

const PostVideoPreviewImg = styled.img`
  z-index: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  // border-radius: 20px;
  opacity: 0.5;
`;

export default PostVideoPreviewElement;
