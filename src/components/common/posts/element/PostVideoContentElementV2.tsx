import { ReactComponent as PostVideoActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoActiveVolumeIcon.svg';
import { ReactComponent as PostVideoNotActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoNotActiveVolumeIcon.svg';
import { ReactComponent as PostVideoPlayActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayActiveButtonIcon.svg';
import { ReactComponent as PostVideoPlayNotActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayNotActiveButtonIcon.svg';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import HlsPlayer from './HLSPlayer';

interface PostVideoContentProps {
  videoSrc: string;
  posterImg: string;
  isUploaded: boolean;
  isClose: boolean;
  onClose: () => void;
}

const PostVideoContentV2: React.FC<PostVideoContentProps> = ({
  videoSrc,
  posterImg,
  isUploaded,
  isClose,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);

    if (videoRef.current) {
      videoRef.current.currentTime =
        (newProgress / 100) * videoRef.current.duration;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
    const touch = e.touches[0];
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const newProgress = (offsetX / rect.width) * 100;

    setProgress(Math.min(Math.max(newProgress, 0), 100));

    if (videoRef.current) {
      videoRef.current.currentTime =
        (Math.min(Math.max(newProgress, 0), 100) / 100) *
        videoRef.current.duration;
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const updateProgress = () => {
      if (videoRef.current?.duration) {
        setProgress(
          (videoRef.current.currentTime / videoRef.current.duration) * 100,
        );
      }
    };

    videoRef.current.addEventListener('timeupdate', updateProgress);
    videoRef.current.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      videoRef.current?.removeEventListener('timeupdate', updateProgress);
      videoRef.current?.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    if (isClose) {
      handlePlayPause();
      onClose();
    }
  }, [isClose]);

  return (
    <VideoContainer>
      {isUploaded ? (
        <>
          <HlsPlayer videoRef={videoRef} src={videoSrc} poster={posterImg} />
          <Controls>
            <PlayButton onClick={handlePlayPause}>
              {isPlaying ? (
                <PostVideoPlayNotActiveButtonIcon />
              ) : (
                <PostVideoPlayActiveButtonIcon />
              )}
            </PlayButton>
            <ProgressBarWrapper>
              <ProgressInput
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleProgressChange}
                onTouchMove={handleTouchMove} // ✅ 터치 이동 반영!
                progress={progress}
              />
            </ProgressBarWrapper>
            <MuteButton onClick={handleMuteUnmute}>
              {isMuted ? (
                <PostVideoNotActiveVolumeIcon />
              ) : (
                <PostVideoActiveVolumeIcon />
              )}
            </MuteButton>
          </Controls>
        </>
      ) : (
        <NotUploadedMessage>영상 업로드 중...</NotUploadedMessage>
      )}
    </VideoContainer>
  );
};

// 스타일 정의
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  overflow: hidden;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const MuteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const ProgressBarWrapper = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const ProgressInput = styled.input<{ progress: number }>`
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

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: ${theme.mainColor.White};
    border-radius: 50%;
  }
`;

const NotUploadedMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: white;
`;

export default PostVideoContentV2;
