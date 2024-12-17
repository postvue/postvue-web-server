import { SERVER_PATH } from 'const/SystemAttrConst';
import Hls from 'hls.js';
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface HlsPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  src: string;
  poster?: string;
  VideoStyle?: React.CSSProperties;
  onError?: () => void;
  autoPlay?: boolean;
  preload?: boolean;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({
  videoRef,
  src,
  poster,
  VideoStyle,
  onError,
  autoPlay = false,
  preload = false,
}) => {
  let isHls = false;

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    try {
      const urlObj = new URL(src); // 유효한 URL인지 확인
      isHls =
        urlObj.pathname.endsWith('.m3u8') && urlObj.origin === SERVER_PATH;
    } catch (e) {
      return;
    }

    if (Hls.isSupported() && isHls) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => hls.destroy();
    }
  }, []);

  return Hls.isSupported() && isHls ? (
    <VideoElement
      ref={videoRef}
      autoPlay={autoPlay}
      playsInline
      poster={poster}
      style={VideoStyle}
      onError={onError}
      preload={preload ? 'auto' : 'none'}
    />
  ) : (
    <VideoElement
      ref={videoRef}
      autoPlay={autoPlay}
      src={src}
      playsInline
      poster={poster}
      style={VideoStyle}
      onError={onError}
      preload={preload ? 'auto' : 'none'}
    />
  );
};

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  vertical-align: bottom;
  border-radius: 20px;
`;

export default HlsPlayer;
