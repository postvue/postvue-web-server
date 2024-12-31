import { ReactComponent as PostVideoPauseButtonIcon } from 'assets/images/icon/svg/post/PostVideoPauseButtonIcon.svg';
import { ReactComponent as PostVideoPlayButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayButtonIcon.svg';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface PostUploadVideoElementProps {
  videoUrl: string;
}

const PostUploadVideoElement: React.FC<PostUploadVideoElementProps> = ({
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const handlePlayPauseVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };
  const handleVideoEnded = () => {
    setPlaying(false);
  };

  useEffect(() => {
    if (!videoRef.current) return;
    setPlaying(!videoRef.current.paused);
  }, [videoRef.current]);

  return (
    <>
      <PostUploadVideo ref={videoRef} onEnded={handleVideoEnded}>
        <source src={videoUrl} type="video/mp4" />
      </PostUploadVideo>
      <PostUploadVideoPlayButtonWrap onClick={() => handlePlayPauseVideo()}>
        {playing ? <PostVideoPauseButtonIcon /> : <PostVideoPlayButtonIcon />}
      </PostUploadVideoPlayButtonWrap>
    </>
  );
};

const PostUploadVideoPlayButtonWrap = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0 0 5px 5px;
  cursor: pointer;
`;

const PostUploadVideo = styled.video`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3 / 4;
  border-radius: 8px;
  background-color: #000000;
`;

export default PostUploadVideoElement;
