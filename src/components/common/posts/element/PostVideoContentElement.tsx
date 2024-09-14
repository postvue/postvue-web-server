import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface PostVideoContentELementProps {
  videoSrc: string;
}

const PostVideoContentELement: React.FC<PostVideoContentELementProps> = ({
  videoSrc,
}) => {
  // 비디오 요소
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [circlePosition, setCirclePosition] = useState<number>(0);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const handleProgressClick = (event: MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (video) {
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const width = rect.width;
      const newTime = (offsetX / width) * video.duration;
      video.currentTime = newTime;
    }
  };

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

      return () => {
        if (video) {
          video.removeEventListener('timeupdate', updateProgress);
        }
      };
    }
  }, [progress, videoRef.current]);

  return (
    <PostVideoContentElement>
      <VideoWrapper
        ref={videoRef}
        playsInline
        webkit-playsinline="true"
        src={videoSrc}
        poster="https://pbs.twimg.com/ext_tw_video_thumb/1833966695108485120/pu/img/_EJDuJXJBD3MrOvJ.jpg"
      />

      {/* Custom Controls */}
      <ControlsWrapper onClick={(e) => e.stopPropagation()}>
        <Button onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={handleMuteUnmute}>Mute/Unmute</Button>
        <ProgressBarWrapper onClick={handleProgressClick}>
          <ProgressBar width={progress} />
          <ProgressCircle left={circlePosition} />
        </ProgressBarWrapper>
      </ControlsWrapper>
    </PostVideoContentElement>
  );
};

// 비디오
const PostVideoContentElement = styled.div`
  position: relative;
`;

const VideoWrapper = styled.video`
  width: 100%;
  height: auto;
  vertical-align: bottom;
  border-radius: 8px;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 50px;
  width: 100%;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ProgressBarWrapper = styled.div`
  width: 80%;
  height: 5px;
  background-color: #eee;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
`;

const ProgressBar = styled.div<{ width: number }>`
  height: 100%;
  background-color: #333;
  width: ${(props) => props.width}%;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
`;

const ProgressCircle = styled.div<{ left: number }>`
  position: absolute;
  top: 50%;
  left: ${(props) => props.left}%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background-color: #ff0000;
  border-radius: 50%;
`;

export default PostVideoContentELement;
