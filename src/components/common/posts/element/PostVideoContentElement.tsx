import { ReactComponent as PostVideoActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoActiveVolumeIcon.svg';
import { ReactComponent as PostVideoNotActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoNotActiveVolumeIcon.svg';
import { ReactComponent as PostVideoPlayActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayActiveButtonIcon.svg';
import { ReactComponent as PostVideoPlayNotActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayNotActiveButtonIcon.svg';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { sendVibrationLightEvent } from 'global/util/reactnative/nativeRouter';
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from 'styles/theme';
import HlsPlayer from './HLSPlayer';

interface PostVideoContentELementProps {
  videoSrc: string;
  posterImg: string;
  isUploaded: boolean;
  stateValue?: string;
  isVisibilityDetection?: boolean;
  visibilityThreshold?: number;
  onVideoError?: () => void;
  isClickPlayToTab?: boolean;
  isClickStop?: boolean;
  onScrollVideoProcessBar?: (isActive: boolean) => void;
  isClose: boolean;
  onClose: () => void;
  PostVideoContentWrapStyle?: React.CSSProperties;
  PostVideoContentELementStyle?: React.CSSProperties;
  PostVideoStyle?: React.CSSProperties;
  PostVideoPosterImgStyle?: React.CSSProperties;
}

const PostVideoContentELement: React.FC<PostVideoContentELementProps> = ({
  videoSrc,
  posterImg,
  isUploaded,
  PostVideoContentWrapStyle,
  PostVideoContentELementStyle,
  PostVideoStyle,
  PostVideoPosterImgStyle,
  stateValue,
  isVisibilityDetection = false,
  visibilityThreshold = 0.7,
  onVideoError,
  isClickPlayToTab = true,
  isClickStop = true,
  onScrollVideoProcessBar,
  isClose,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState<number>(0);
  const [showIcon, setShowIcon] = useState(false); // 아이콘 표시 여부

  const onVideoPlay = (video: HTMLVideoElement, isPlay: boolean) => {
    if (isPlay) {
      video.play().catch(() => {
        ('');
      });
    } else {
      video.pause();
    }
  };

  const handlePlayPause = (play: boolean) => {
    const video = videoRef.current;
    if (video) {
      onVideoPlay(video, play);
      setIsPlaying(play);
    }
  };

  const handleMuteUnmute = (mute: boolean) => {
    const video = videoRef.current;
    if (video) {
      video.muted = mute;
      setIsMuted(mute);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);

    // if (videoRef.current) {
    //   videoRef.current.currentTime =
    //     (newProgress / 100) * videoRef.current.duration;
    // }
    if (!videoRef.current) return;
    const newTime = (newProgress / 100) * videoRef.current.duration;
    const currentVideoTime = videoRef.current.currentTime;

    // 새 시간과 기존 시간의 차이가 1초 이상일 때만 업데이트
    if (Math.abs(newTime - currentVideoTime) >= 1.5) {
      videoRef.current.currentTime = newTime;
      // setProgress(newProgress);
    }
  };

  const handleProgressMove = (
    event: React.TouchEvent<HTMLDivElement>,
  ): void => {
    if (onScrollVideoProcessBar) {
      onScrollVideoProcessBar(true);
    }

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      onVideoPlay(video, false);
    }

    moveProcessBarSmoothly(event);
  };

  const moveProcessBarSmoothly = (event: React.TouchEvent<HTMLDivElement>) => {
    moveProcessBarByEvent(event);
  };

  const handleProgressDown = (event: React.TouchEvent<HTMLDivElement>) => {
    moveProcessBarSmoothly(event);
  };

  const handleProcessEnd = () => {
    if (onScrollVideoProcessBar) {
      onScrollVideoProcessBar(false);
    }
  };

  // 마우스 이벤트 처리

  // 터치 이벤트 처리
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    sendVibrationLightEvent();
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    handleProgressMove(event as unknown as React.TouchEvent<HTMLDivElement>);
  };

  // const handleTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
  //   const touch = e.touches[0];
  //   const target = e.currentTarget;
  //   const rect = target.getBoundingClientRect();
  //   const offsetX = touch.clientX - rect.left;
  //   const newProgress = (offsetX / rect.width) * 100;

  //   setProgress(Math.min(Math.max(newProgress, 0), 100));

  //   if (videoRef.current) {
  //     videoRef.current.currentTime =
  //       (Math.min(Math.max(newProgress, 0), 100) / 100) *
  //       videoRef.current.duration;
  //   }
  // };

  const animationFrameRef = useRef<number | null>(null);
  const prevProgressRef = useRef<number>(0); // 이전 프로그레스 저장
  const moveProcessBarByEvent = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const touch = e.touches[0];
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;

    // 소수점 두 자리까지 반올림하여 작은 변화 무시
    let newProgress = Math.round((offsetX / rect.width) * 100 * 10) / 10;
    newProgress = Math.min(Math.max(newProgress, 0), 100);

    // 이전 progress 값과 비교해서 너무 작은 변화면 무시
    if (Math.abs(newProgress - prevProgressRef.current) < 0.1) return;

    prevProgressRef.current = newProgress; // 이전 progress 저장

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setProgress(newProgress);
    });

    // 비디오 시간 업데이트 (1.5초 이상 차이날 때만)
    const newTime = (newProgress / 100) * videoRef.current.duration;
    const currentVideoTime = videoRef.current.currentTime;

    if (Math.abs(newTime - currentVideoTime) >= 1) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleTouchEnd = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      onVideoPlay(video, isPlaying);
    }
    handleProcessEnd();
  };

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [stateValue]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const newProgress = (video.currentTime / video.duration) * 100;
        progressRef.current = newProgress;

        requestAnimationFrame(() => {
          setProgress(progressRef.current);
        });
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', () => handlePlayPause(false));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', () => handlePlayPause(false));
    };
  }, []);

  const posterRef = useRef<HTMLImageElement>(null); // 포스터 이미지를 참조
  const [videoStyle, setVideoStyle] = useState({
    height: 'auto',
  });

  const PostVideoContentWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 포스터 크기 가져오기
    const poster = posterRef.current;
    const width = PostVideoContentWrapRef.current?.clientWidth;
    if (poster && width) {
      const updateVideoStyle = () => {
        const height = `${Math.round(
          (poster.height / poster.width) *
            (width <= MEDIA_MOBILE_MAX_WIDTH_NUM
              ? width < theme.systemSize.appDisplaySize.maxWidthNum
                ? width
                : theme.systemSize.appDisplaySize.maxWidthNum
              : theme.systemSize.appDisplaySize.profilePostMaxWidthNum),
        )}px`;
        if (videoStyle.height === height) return;

        setVideoStyle({
          height: height,
        });
      };

      // 이미지가 로드된 후 크기를 설정
      if (poster.complete) {
        updateVideoStyle();
      } else {
        poster.onload = updateVideoStyle;
      }
    }
  }, [PostVideoContentWrapRef.current?.clientWidth]);

  useEffect(() => {
    if (!isClose) return;
    handlePlayPause(false);
    onClose();
  }, [isClose]);

  return (
    <PostVideoContentWrap
      ref={PostVideoContentWrapRef}
      style={{
        ...videoStyle,
        ...{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
        },
        ...{ PostVideoContentWrapStyle },
      }}
    >
      {isUploaded ? (
        <>
          <PostVideoPreviewImg
            ref={posterRef}
            src={posterImg}
            alt="poster"
            style={PostVideoPosterImgStyle}
          />
          <PostVideoContentElement
            style={PostVideoContentELementStyle}
            onClick={() => {
              if (!(isPlaying && isClickStop) && !isClickPlayToTab) return;
              handlePlayPause(!isPlaying);
              // 아이콘 표시
              setShowIcon(true);

              // 일정 시간 후 아이콘 숨김
              setTimeout(() => setShowIcon(false), 500); // 500ms 후 사라짐
            }}
          >
            <HlsPlayer
              videoRef={videoRef}
              src={videoSrc}
              poster={posterImg}
              VideoStyle={PostVideoStyle}
              onError={() => {
                if (!onVideoError) return;
                onVideoError();
              }}
            />
            <ControlsWrapper onClick={(e) => e.stopPropagation()}>
              <PlayerContainer>
                <PlayerSubContainer>
                  <VidePlayButton
                    onClick={() => {
                      handlePlayPause(!isPlaying);
                    }}
                  >
                    {isPlaying ? (
                      <PostVideoPlayNotActiveButtonIcon />
                    ) : (
                      <PostVideoPlayActiveButtonIcon />
                    )}
                  </VidePlayButton>
                  <ProgressBarWrapper>
                    <ProgressInput
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={progress}
                      onTouchStart={handleTouchStart}
                      // onChange={handleProgressChange}
                      onTouchMove={handleTouchMove} // ✅ 터치 이동 반영
                      onTouchEnd={handleTouchEnd}
                      progress={progress}
                    />
                  </ProgressBarWrapper>

                  <SoundVolumeButton onClick={() => handleMuteUnmute(!isMuted)}>
                    {isMuted ? (
                      <PostVideoNotActiveVolumeIcon />
                    ) : (
                      <PostVideoActiveVolumeIcon />
                    )}
                  </SoundVolumeButton>
                </PlayerSubContainer>
              </PlayerContainer>
            </ControlsWrapper>

            {showIcon && (
              <PlayPauseIcon>
                {isPlaying ? (
                  <PostVideoPlayNotActiveButtonIcon />
                ) : (
                  <PostVideoPlayActiveButtonIcon />
                )}
              </PlayPauseIcon>
            )}
          </PostVideoContentElement>
        </>
      ) : (
        <NotUploadedVideoTemplate>
          <NotUploadedVideoBackgroundImg
            src={posterImg}
            style={PostVideoPosterImgStyle}
          />
          <NotUploadedVideoBackgroundFilter style={PostVideoPosterImgStyle} />
          <NotUploadedVideoTitle>
            영상 업로드에 시간이 조금 걸릴 수 있어요.
            <br />
            기다리는 동안 다른 게시물을 구경해보세요!
          </NotUploadedVideoTitle>
        </NotUploadedVideoTemplate>
      )}
    </PostVideoContentWrap>
  );
};

const PostVideoContentWrap = styled.div``;

const PostVideoContentElement = styled.div`
  position: relative;
  height: 100%;
  z-index: 1;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0px;
  width: 100%;

  padding: 30px 0 20px 0;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent);
  border-radius: 0px;
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 0 0 20px 20px;
  }
`;

const PlayerContainer = styled.div`
  width: 100%;
`;

const PlayerSubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const SoundVolumeButton = styled.div`
  padding: 5px;
  cursor: pointer;
`;

const VidePlayButton = styled.div`
  padding: 5px;
  cursor: pointer;
`;

const scaleUp = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.3.5
  }
  75% {
    transform: scale(1.5);
    opacity: 0.25;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

// 아이콘 스타일
const PlayPauseIcon = styled.div`
  position: absolute;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.grey.Grey8};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${scaleUp} 0.55s ease-out;
  pointer-events: none; // 클릭 방지
`;

const PostVideoPreviewImg = styled.img`
  z-index: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const NotUploadedVideoTemplate = styled.div`
  position: relative;
`;

const NotUploadedVideoBackgroundImg = styled.img`
  border-radius: 20px;
  width: 100%;
  vertical-align: bottom;
`;

const NotUploadedVideoBackgroundFilter = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.grey.Grey9};
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0.5;
  border-radius: 20px;
`;

const NotUploadedVideoTitle = styled.div`
  color: white;
  font: ${({ theme }) => theme.fontSizes.Body4};
  font-size: 18px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  white-space: nowrap;
`;

const ProgressBarWrapper = styled.div`
  flex: 1;
  margin: 0 10px;
  display: flex;
`;

const ProgressInput = styled.input<{ progress: number }>`
  margin: auto 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(
    to right,
    ${theme.mainColor.White} ${({ progress }) => progress}%,
    rgba(255, 255, 255, 0.4) ${({ progress }) => progress}%
  );
  border-radius: 5px;
  appearance: none;
  cursor: pointer;
  position: relative;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px; /* 기존 크기 */
    height: 16px; /* 기존 크기 */
    background: ${theme.mainColor.White};
    border-radius: 50%;
    position: relative;
    z-index: 2;
  }

  &::-webkit-slider-runnable-track {
    padding: 10px 0;
    background-color: transparent;
  }
`;

export default PostVideoContentELement;
