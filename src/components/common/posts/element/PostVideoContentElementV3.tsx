import { ReactComponent as PostVideoActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoActiveVolumeIcon.svg';
import { ReactComponent as PostVideoNotActiveVolumeIcon } from 'assets/images/icon/svg/post/PostVideoNotActiveVolumeIcon.svg';
import { ReactComponent as PostVideoPlayActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayActiveButtonIcon.svg';
import { ReactComponent as PostVideoPlayNotActiveButtonIcon } from 'assets/images/icon/svg/post/PostVideoPlayNotActiveButtonIcon.svg';
import 'components/lib/videoseekslider/styles.scss';
import VideoSeekSlider from 'components/lib/videoseekslider/VideoSeekSlider';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from 'styles/theme';
import HlsPlayer from './HLSPlayer';

let isMuted = false;

interface PostVideoContentElementV3Props {
  postId: string;
  videoSrc: string;
  posterImg: string;
  isUploaded: boolean;
  isClose: boolean;
  onClose: () => void;
  actionPopupTopScrollByMoveSeekBar: (isActive: boolean) => void;
  onVideoError?: () => void;
  PostVideoStyle?: React.CSSProperties;
  PostVideoContentWrapStyle?: React.CSSProperties;
  PostVideoPosterImgStyle?: React.CSSProperties;
  PostVideoContentELementStyle?: React.CSSProperties;
}

const PostVideoContentElementV3: React.FC<PostVideoContentElementV3Props> = ({
  postId,
  videoSrc,
  posterImg,
  isUploaded,
  isClose,
  actionPopupTopScrollByMoveSeekBar,
  onClose,
  onVideoError,
  PostVideoStyle,
  PostVideoPosterImgStyle,
  PostVideoContentWrapStyle,
  PostVideoContentELementStyle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const interval = useRef<NodeJS.Timeout | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(0);

  // 프로세스 바 움직임 감지
  const handleTimeChange = useCallback((time: number, offsetTime: number) => {
    if (!videoRef.current?.currentTime) {
      return;
    }

    videoRef.current.muted = true;

    videoRef.current.currentTime = time / 1000;
    setCurrentTime(time);

    if (actionPopupTopScrollByMoveSeekBar) {
      actionPopupTopScrollByMoveSeekBar(true);
    }
  }, []);

  // 프로세스 영역 놓다 뻈을 떄
  const actionByReleaseBar = () => {
    if (actionPopupTopScrollByMoveSeekBar) {
      actionPopupTopScrollByMoveSeekBar(false);
    }

    if (videoRef.current) {
      if (videoRef.current.muted && !isMuted) {
        handleMuteUnmute(false);
      }
    }
  };

  const handlePlay = () => {
    interval.current = setInterval(() => {
      setCurrentTime((videoRef.current?.currentTime || 0) * 1000);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(interval.current);
  };

  const handleDataLoaded = () => {
    setMaxTime((videoRef.current?.duration || 0) * 1000);
  };

  const handleProgress = () => {
    const buffer = videoRef?.current?.buffered;

    if (!buffer) return;

    if (((buffer.length > 0 && videoRef.current?.duration) || 0) > 0) {
      let currentBuffer = 0;
      const inSeconds = videoRef.current?.currentTime || 0;

      for (let i = 0; i < buffer.length; i++) {
        if (buffer.start(i) <= inSeconds && inSeconds <= buffer.end(i)) {
          currentBuffer = i;
          break;
        }
      }

      setProgress(buffer.end(currentBuffer) * 1000 || 0);
    }
  };

  // 비디오 처음으로 이동 시키기
  const pauseByEnd = () => {
    handlePlayPause(false);
    setProgress(0);
    setCurrentTime(0);
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (!videoRef) {
      return;
    }

    videoRef.current?.addEventListener('play', handlePlay);
    videoRef.current?.addEventListener('pause', handlePause);
    videoRef.current?.addEventListener('loadeddata', handleDataLoaded);
    videoRef.current?.addEventListener('progress', handleProgress);
    videoRef.current?.addEventListener('ended', pauseByEnd);
  }, [videoRef]);

  // 포스트 이미지
  const posterRef = useRef<HTMLImageElement>(null); // 포스터 이미지를 참조
  const PostVideoContentWrapRef = useRef<HTMLDivElement>(null);

  const [videoStyle, setVideoStyle] = useState({
    height: 'auto',
  });

  useEffect(() => {
    // 포스터 크기 가져오기
    const poster = posterRef.current;
    const width = PostVideoContentWrapRef.current?.clientWidth;
    if (poster && width) {
      const updateVideoStyle = () => {
        const poster_ = posterRef.current;
        if (!poster_) return;
        const height = `${Math.round(
          (poster_.height / poster_.width) *
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
  }, [
    postId,
    posterImg,
    posterRef.current?.width,
    PostVideoContentWrapRef.current?.clientWidth,
  ]);

  // 소리 버튼 유틸
  const handleMuteUnmute = (mute: boolean) => {
    const video = videoRef.current;
    if (video) {
      video.muted = mute;
      isMuted = mute;
    }
  };

  // 비디오 실행 유틸
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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

  // 화면 터치 액션
  const [showIcon, setShowIcon] = useState(false); // 아이콘 표시 여부

  // 비디오 콘텐츠가 바뀌는 지?
  useEffect(() => {
    setVideoStyle({ height: 'auto' });
    setIsPlaying(false);
    pauseByEnd();
  }, [postId]);

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

            <PlayerControlContainer>
              {/* <div style={{ color: 'white' }}>
                김치: {posterRef.current?.height}
              </div> */}
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
                <SeekSliderContainer
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <SeekSliderWrap>
                    <VideoSeekSlider
                      max={maxTime}
                      currentTime={currentTime}
                      bufferTime={progress}
                      onChange={handleTimeChange}
                      actionByReleaseBar={actionByReleaseBar}
                      limitTimeTooltipBySides={true}
                    />
                  </SeekSliderWrap>
                </SeekSliderContainer>
                <SoundVolumeButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMuteUnmute(!isMuted);
                  }}
                >
                  {isMuted ? (
                    <PostVideoNotActiveVolumeIcon />
                  ) : (
                    <PostVideoActiveVolumeIcon />
                  )}
                </SoundVolumeButton>
              </PlayerSubContainer>
            </PlayerControlContainer>

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

const PlayerControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0px;
  width: 100%;

  padding: 30px 0 0 0;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent);
  border-radius: 0px;
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 0 0 20px 20px;
  }
`;

const PlayerSubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const SeekSliderContainer = styled.div`
  // position: absolute;
  bottom: 0px;
  width: 100%;
`;

const SeekSliderWrap = styled.div`
  width: calc(100% - 20px);
  margin: 0 10px;

  padding: 30px 0 50px 0;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 0 0 20px 20px;
  }
`;

// 비디오 실행 버튼
const VidePlayButton = styled.div`
  padding: 5px;
  cursor: pointer;
  z-index: 100;
  margin: auto 0;
`;

// 소리 버튼
const SoundVolumeButton = styled.div`
  padding: 5px;
  cursor: pointer;
  z-index: 200;
  margin: auto 0;
`;

// 업로드 확인
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

// 화면 터치 실행 중단 버튼
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

// 미리보기 이미지
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

export default PostVideoContentElementV3;
