import { ReactComponent as PostVideoActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoActiveVolumeIcon.svg';
import { ReactComponent as PostVideoNotActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoNotActiveVolumeIcon.svg';
import { ReactComponent as PostVideoPlayActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayActiveButtonIcon.svg';
import { ReactComponent as PostVideoPlayNotActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayNotActiveButtonIcon.svg';
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from 'styles/theme';
import HlsPlayer from './HLSPlayer';

interface PostVideoContentELementProps {
  videoSrc: string;
  posterImg: string;
  PostVideoContentELementStyle?: React.CSSProperties;
  PostVideoStyle?: React.CSSProperties;
  stateValue?: string;
  isVisibilityDetection?: boolean;
  visibilityThreshold?: number;
  onVideoError?: () => void;
}

const PostVideoContentELement: React.FC<PostVideoContentELementProps> = ({
  videoSrc,
  posterImg,
  PostVideoContentELementStyle,
  PostVideoStyle,
  stateValue,
  isVisibilityDetection = false,
  visibilityThreshold = 0.7,
  onVideoError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [circlePosition, setCirclePosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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

  // const handleProgressClick = (event: MouseEvent<HTMLDivElement>) => {
  //   const video = videoRef.current;
  //   if (video && progressBarRef.current) {
  //     const rect = progressBarRef.current.getBoundingClientRect();
  //     const offsetX = event.clientX - rect.left;
  //     const width = rect.width;
  //     const newTime = (offsetX / width) * video.duration;
  //     video.currentTime = newTime;
  //   }
  // };

  // 모바일 터치 처리
  // const handleProgressTouchStart = (
  //   event: React.TouchEvent<HTMLDivElement>,
  // ) => {
  //   const touch = event.touches[0];
  //   const rect = progressBarRef.current?.getBoundingClientRect();
  //   if (!(rect && touch)) return;

  //   const offsetX = touch.clientX - rect.left;
  //   const width = rect.width;
  //   const newTime = (offsetX / width) * (videoRef.current?.duration || 0);
  //   if (videoRef.current) {
  //     videoRef.current.currentTime = newTime;
  //   }
  //   setIsDragging(true);
  // };

  // const handleProgressTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
  //   if (!isDragging) return;
  //   const touch = event.touches[0];
  //   const rect = progressBarRef.current?.getBoundingClientRect();
  //   if (rect && touch) {
  //     const offsetX = touch.clientX - rect.left;
  //     const width = rect.width;
  //     const newTime = (offsetX / width) * (videoRef.current?.duration || 0);
  //     if (videoRef.current) {
  //       videoRef.current.currentTime = newTime;
  //     }
  //   }
  // };

  const moveProcessBarByEvent = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!(progressBarRef.current && videoRef.current)) return;
    const clientX =
      'touches' in event
        ? event.touches[0].clientX // 터치 이벤트
        : event.clientX; // 마우스 이벤트

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = Math.min(
      Math.max(clientX - rect.left, 0), // Ensure within bounds
      rect.width,
    );
    const width = rect.width;
    const newProgress = (offsetX / width) * 100;
    const newTime = (offsetX / width) * videoRef.current.duration;

    setProgress(newProgress);
    setCirclePosition(newProgress);
    videoRef.current.currentTime = newTime;
  };

  const handleProgressMove = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ): void => {
    if (!isDragging) return;
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      onVideoPlay(video, false);
    }

    requestAnimationFrame(() => {
      moveProcessBarByEvent(event);
    });
  };

  const handleProgressDown = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ) => {
    setIsDragging(true);
    moveProcessBarByEvent(event);
  };

  const handleProcessEnd = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      onVideoPlay(video, isPlaying);
    }

    setIsDragging(false);
  };

  // 마우스 이벤트 처리
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    handleProgressDown(event);
  };

  const handleMouseMove = (event: globalThis.MouseEvent) => {
    if (isDragging) {
      handleProgressMove(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  const handleMouseUp = () => {
    handleProcessEnd();
  };

  // 터치 이벤트 처리
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    handleProgressDown(event);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressMove(event as unknown as React.TouchEvent<HTMLDivElement>);
    }
  };

  const handleTouchEnd = () => {
    handleProcessEnd();
  };

  useEffect(() => {
    if (!isVisibilityDetection) return;
    const video = videoRef.current;

    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (video.error !== null) return;

        if (entry.isIntersecting) {
          onVideoPlay(video, true);
          setIsPlaying(true);
        } else {
          onVideoPlay(video, false);
          setIsPlaying(false);
        }
      },
      { threshold: visibilityThreshold }, // 비디오의 50%가 보일 때 동작
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setCirclePosition(0);
    setProgress(0);
    setIsPlaying(false);
  }, [stateValue]);

  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => {
      if (video && video.duration) {
        const newProgress = (video.currentTime / video.duration) * 100;
        setProgress(newProgress);
        setCirclePosition(newProgress);
      }
    };

    if (video) {
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('ended', () => handlePlayPause(false));

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('ended', () => handlePlayPause(false));
      };
    }
  }, [progress]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const updateMasonryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <PostVideoContentElement
      style={PostVideoContentELementStyle}
      onClick={() => {
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

          alert(videoRef.current?.error?.message);
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
            <ProgressBarWrapper
              ref={progressBarRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
            >
              <ProgressBarOverlay />
              <ProgressBar width={progress} />
              <ProgressCircleWrap $left={circlePosition}>
                <ProgressCircle $isDragging={isDragging} />
              </ProgressCircleWrap>
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
  );
};

const PostVideoContentElement = styled.div`
  position: relative;
  height: 100%;
  background-color: black;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0px;
  width: 100%;

  padding: 30px 0 20px 0;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  border-radius: 20px;
`;

const PlayerContainer = styled.div`
  width: 100%;
`;

const PlayerSubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const ProgressBarWrapper = styled.div`
  margin: auto 0;
  padding: 10px 0;
  width: calc(100% - 80px);
  position: relative;
  cursor: pointer;
`;

const ProgressBarOverlay = styled.div`
  margin: auto 0;
  width: 100%;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 5px;
`;

const ProgressBar = styled.div<{ width: number }>`
  background-color: ${theme.mainColor.White};
  width: ${(props) => props.width}%;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 0;
  height: 5px;
`;

const ProgressCircleWrap = styled.div<{ $left: number }>`
  position: absolute;
  top: 50%;
  left: ${(props) => props.$left}%;
  transform: translate(-50%, -50%);
  padding: 20px;
  cursor: grab;
`;

const ProgressCircle = styled.div<{ $isDragging: boolean }>`
  position: absolute;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.$isDragging ? '16px' : '14px')}; /* 크기 변경 */
  height: ${(props) => (props.$isDragging ? '16px' : '14px')};
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 20px;
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

export default PostVideoContentELement;
