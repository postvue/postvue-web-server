import { ReactComponent as PostVideoActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoActiveVolumeIcon.svg';
import { ReactComponent as PostVideoNotActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoNotActiveVolumeIcon.svg';
import { ReactComponent as PostVideoPlayActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayActiveButtonIcon.svg';
import { ReactComponent as PostVideoPlayNotActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayNotActiveButtonIcon.svg';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import styled, { keyframes } from 'styled-components';
import theme from 'styles/theme';

interface PostVideoContentELementProps {
  videoSrc: string;
  PostVideoContentELementStyle?: React.CSSProperties;
  PostVideoStyle?: React.CSSProperties;
  stateValue?: string;
  isVisibilityDetection?: boolean;
  visibilityThreshold?: number;
}

const PostVideoContentELementTest: React.FC<PostVideoContentELementProps> = ({
  videoSrc,
  PostVideoContentELementStyle,
  PostVideoStyle,
  stateValue,
  isVisibilityDetection = false,
  visibilityThreshold = 0.7,
}) => {
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [circlePosition, setCirclePosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState(false); // 아이콘 표시 여부

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteUnmute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressMove = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ): void => {
    setIsMuted(false);
    if (!(isDragging && progressBarRef.current)) return;

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
    const newTime = (offsetX / width) * duration;

    setProgress(newProgress);
    setCirclePosition(newProgress);
    playerRef.current?.seekTo(newTime);
  };

  // 마우스 이벤트 처리
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressMove(event);
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
    setIsDragging(true);
    handleProgressMove(event);
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (isDragging) {
      handleProgressMove(event as unknown as React.TouchEvent<HTMLDivElement>);
    }
  };

  const handleTouchEnd = () => {
    handleProcessEnd();
  };

  const handleProcessEnd = () => {
    setIsPlaying(false);
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isVisibilityDetection) return;
    const video = videoWrapperRef.current;
    const player = playerRef.current;

    if (!video || !player) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
          const a = player.getInternalPlayer();
          a;
        } else {
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

  const updateProgress = (progress: OnProgressProps) => {
    const newProgress = (progress.playedSeconds / duration) * 100;
    setProgress(newProgress);
    setCirclePosition(newProgress);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <PostVideoContentElement
      style={PostVideoContentELementStyle}
      onClick={() => {
        handlePlayPause();
        // 아이콘 표시
        setShowIcon(true);

        // 일정 시간 후 아이콘 숨김
        setTimeout(() => setShowIcon(false), 500); // 500ms 후 사라짐
      }}
    >
      <VideoWrapper ref={videoWrapperRef} style={PostVideoStyle}>
        <ReactPlayer
          ref={playerRef}
          url={
            'https://media.feelog.net/videos/hls/5feed669-fc17-4af6-b71f-008897b1a5d6/output.m3u8'
          }
          width={'100%'}
          height={'100%'}
          style={{ verticalAlign: 'bottom' }}
          playing={isPlaying}
          muted={isMuted}
          onProgress={updateProgress}
          onDuration={(duration) => setDuration(duration)}
          onPlay={() => setIsMuted(false)}
          onEnded={handleProcessEnd}
          playsinline
        />
      </VideoWrapper>
      <ControlsWrapper onClick={(e) => e.stopPropagation()}>
        <PlayerContainer>
          <PlayerSubContainer>
            <VidePlayButton onClick={handlePlayPause}>
              {isPlaying ? (
                <PostVideoPlayNotActiveButtonIcon />
              ) : (
                <PostVideoPlayActiveButtonIcon />
              )}
            </VidePlayButton>
            <ProgressBarWrapper
              ref={progressBarRef}
              onTouchStart={handleTouchStart}
              onMouseDown={handleMouseDown}
            >
              <ProgressBar width={progress} />
              <ProgressCircle $left={circlePosition} $isDragging={isDragging} />
            </ProgressBarWrapper>
            <SoundVolumeButton onClick={handleMuteUnmute}>
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
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  border-radius: 20px;
  height: 100%;
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
  width: calc(100% - 80px);
  height: 5px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  position: relative;
  cursor: pointer;
`;

const ProgressBar = styled.div<{ width: number }>`
  height: 100%;
  background-color: ${theme.mainColor.White};
  width: ${(props) => props.width}%;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
`;

const ProgressCircle = styled.div<{ $left: number; $isDragging: boolean }>`
  position: absolute;
  top: 50%;
  left: ${(props) => props.$left}%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.$isDragging ? '16px' : '14px')}; /* 크기 변경 */
  height: ${(props) => (props.$isDragging ? '16px' : '14px')};
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 50%;
  cursor: grab;
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

const StyledReactPlayer = styled(ReactPlayer)``;

export default PostVideoContentELementTest;
