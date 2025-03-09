import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import PostSettingDotButton from 'components/common/buttton/PostSettingDotButton';
import { Location, PostRsp } from 'global/interface/post';
import { formatToMinutesAndSeconds } from 'global/util/DateTimeUtil';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { masonryUpdateCountAtom } from 'states/MasonryAtom';
import styled from 'styled-components';
import { hoverFilterBrigntnessStyle } from 'styles/commonStyles';
import theme from 'styles/theme';
import PostElementLocation from './PostElementLocation';

interface PostVideoPreviewELementProps {
  postId: string;
  activeVideoId: string | null;
  autoPlayMode?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onLoadedData?: React.ReactEventHandler<HTMLVideoElement>;
  videoSrc: string;
  videoDuration: number;
  posterImg: string;
  selectPostRsp: PostRsp;
  scrapId: string | undefined;
  location: Location;
  ContentBorderRadius: number;
  longPressToResizeNum: number | undefined;
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
  selectPostRsp,
  scrapId,
  location,
  ContentBorderRadius,
  longPressToResizeNum,
  videoDuration,
  posterImg,
  PostVideoStyle,
  isVisibilityDetection = false,
  visibilityThreshold = 0.7,
  actionFuncByRef,
  onError,
}) => {
  const [onload, setOnload] = useState<boolean>(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const autoPlayRef = useRef<boolean>(false);

  useEffect(() => {
    autoPlayRef.current = autoPlayMode;
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

          //     resolve();
          //   });
          // });

          if (video.paused) {
            video.play().catch(() => {
              ('');
            });
          }
        } else {
          if (video.paused) return;
          video.pause();
        }
      },
      { threshold: visibilityThreshold },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, [visibilityThreshold, activeVideoId]);

  // @REFER: 비디오 자동 실행 구현 완료시
  // useEffect(() => {
  //   if (isVisibilityDetection) {
  //     const cleanup = handleVisibility(); // visibility detection 핸들러 실행
  //     return cleanup; // 컴포넌트 unmount 시 observer 해제
  //   }
  // }, [isVisibilityDetection, handleVisibility]); // 의존성 배열로 최적화

  const [isError, setIsError] = useState(false);

  const setMasonryUpdateCount = useSetRecoilState(masonryUpdateCountAtom);

  return (
    <>
      <PostVideoAddressWrap>
        <LongPressToResizeButton resize={longPressToResizeNum || 0.98}>
          <div
            style={{
              ...{
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
              },
            }}
          >
            <VideoDurationWrap>
              <VideoDurationElement>
                {formatToMinutesAndSeconds(videoDuration)}
              </VideoDurationElement>
            </VideoDurationWrap>
            {!isError && (
              <>
                {!onload && (
                  <PostVideoPreviewMockImg
                    style={{
                      opacity: onload ? 0 : 1,
                      position: onload ? 'absolute' : 'relative',
                      transition: 'opacity 0.3s ease-in-out',
                    }}
                  />
                )}
                <PostVideoPreviewImg
                  src={posterImg}
                  style={{
                    opacity: onload ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                  onError={() => {
                    setIsError(true);
                  }}
                  onLoad={() => {
                    setOnload(true);
                    setTimeout(() => {
                      setMasonryUpdateCount((prev) => prev + 1);
                    }, 50);
                  }}
                />
              </>
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

          {onload && location.address && (
            <PostElementLocation
              location={location}
              ContentBorderRadius={ContentBorderRadius}
            />
          )}
        </LongPressToResizeButton>
      </PostVideoAddressWrap>

      <PostSettingDotButton selectPostRsp={selectPostRsp} scrapId={scrapId} />
    </>
  );
};

const PostVideoAddressWrap = styled.div`
  position: relative;
  cursor: pointer;
  height: 100%;

  ${hoverFilterBrigntnessStyle}
`;

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
  z-index: 1; /* 스켈레톤보다 위에 위치 */
  transition: opacity 0.3s ease-in-out;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-radius: 20px;
  opacity: 0.5;
`;

const PostVideoPreviewMockImg = styled.div`
  z-index: 0;
  transition: opacity 0.3s ease-in-out;
  background-color: ${theme.grey.Grey1};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-radius: 20px;
  opacity: 0.5;
  aspect-ratio: 3 / 4;
`;

const VideoDurationWrap = styled.div`
  position: absolute;
  top: 0px;
  padding: 3px 9px;
  margin: 8px 0px 0px 8px;
  border-radius: 20px;

  background-color: rgb(247 247 247 / 50%);
  z-index: 10;
`;

const VideoDurationElement = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 13px;
  color: ${({ theme }) => theme.grey.Grey9};
`;

export default PostVideoPreviewElement;
