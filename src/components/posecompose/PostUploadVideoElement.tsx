import { ReactComponent as PostVideoPauseButtonIcon } from 'assets/images/icon/svg/post/PostVideoPauseButtonIcon.svg';
import { ReactComponent as PostVideoPlayButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayButtonIcon.svg';
import HlsPlayer from 'components/common/posts/element/HLSPlayer';
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
      <HlsPlayer
        src={videoUrl}
        videoRef={videoRef}
        onEnded={handleVideoEnded}
        VideoStyle={{
          aspectRatio: '3/4',
          borderRadius: '8px',
        }}
      />
      <PostUploadVideoPlayButtonWrap onClick={() => handlePlayPauseVideo()}>
        {playing ? (
          <PostComposeDeleteButtonWrap>
            <PostComposeDeleteIconButton>
              <PostComposeDeleteSubButton>
                <PostVideoPauseButtonIcon />
              </PostComposeDeleteSubButton>
            </PostComposeDeleteIconButton>
          </PostComposeDeleteButtonWrap>
        ) : (
          <PostComposeDeleteButtonWrap>
            <PostComposeDeleteIconButton>
              <PostComposeDeleteSubButton>
                <PostVideoPlayButtonIcon />
              </PostComposeDeleteSubButton>
            </PostComposeDeleteIconButton>
          </PostComposeDeleteButtonWrap>
        )}
      </PostUploadVideoPlayButtonWrap>
    </>
  );
};

const PostUploadVideoPlayButtonWrap = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0 5px 5px 0;
  cursor: pointer;
`;

const PostComposeDeleteButtonWrap = styled.div`
  position: absolute;
  bottom: 0;
  margin: 8px;
  cursor: pointer;
`;
const PostComposeDeleteIconButton = styled.div`
  background-color: black;
  display: flex;
  border-radius: 50%;
  height: 25px;
  width: 25px;
`;

const PostComposeDeleteSubButton = styled.div`
  display: flex;
  margin: auto;
`;

export default PostUploadVideoElement;
