import Hls from 'hls.js';
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface HlsPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  src: string;
  poster?: string;
  VideoStyle?: React.CSSProperties;
  onError?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  preload?: boolean;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({
  videoRef,
  src,
  poster,
  VideoStyle,
  onEnded,
  onError,
  autoPlay = false,
  preload = false,
}) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isHls = false;
    let hls: Hls | null = null;

    try {
      const urlObj = new URL(src);
      isHls = urlObj.pathname.endsWith('.m3u8');
    } catch (e) {
      return;
    }

    if (Hls.isSupported() && isHls) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('네트워크 에러 발생');
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('미디어 에러 발생, 복구 시도');
              hls?.recoverMediaError();
              break;
            default:
              console.error('치명적인 에러 발생, HLS 파괴');
              hls?.destroy();
          }
        }
      });
    } else {
      video.src = src; // 일반 비디오 파일 처리
    }

    return () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };
  }, [src]); // src가 변경될 때마다 실행됨

  return (
    <VideoElement
      ref={videoRef}
      autoPlay={autoPlay}
      playsInline
      poster={poster}
      style={VideoStyle}
      onError={onError}
      onEnded={onEnded}
      preload={preload ? 'auto' : 'none'}
    />
  );
};

const VideoElement = styled.video`
  width: 100%;
  object-fit: cover;
  height: 100%;
  vertical-align: bottom;
  border-radius: 20px;
  pointer-events: none;
`;

export default HlsPlayer;
