import React, { Suspense, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import styled from 'styled-components';
import 'swiper/css';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import {
  POST_IMAGE_TYPE,
  POST_VIDEO_TYPE,
} from '../../../const/PostContentTypeConst';
import {
  postContentZoomPopupInfoAtom,
  postExternelEventInfoAtom,
} from '../../../states/PostAtom';

import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import 'swiper/css/pagination';

import { PostRsp } from 'global/interface/post';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const initTimer = 500;

const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

const PostVideoContentElementV3 = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      setTimeout(
        () => {
          import(
            'components/common/posts/element/PostVideoContentElementV3'
          ).then((module) => resolve({ default: module.default }));
        },
        isMobile() ? 1000 : 0,
      ); // 1초 후 로드
    }),
);

interface ProfilePostDetailBodyProps {
  postId: string;
  snsPost: PostRsp;
  windowWidthSize: number;
  PostImageWrapStyle?: React.CSSProperties;
}

const ProfilePostDetailBodySwiper: React.FC<ProfilePostDetailBodyProps> = ({
  postId,
  snsPost,
  windowWidthSize,
  PostImageWrapStyle,
}) => {
  const setPostContentZoomPopupInfo = useSetRecoilState(
    postContentZoomPopupInfoAtom,
  );

  const [postExternelEventInfo, setPostExternelEventInfo] = useRecoilState(
    postExternelEventInfoAtom,
  );

  const [swiperScrollInfo, setSwiperScrollInfo] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const SCROLL_THRESHOLD = 10; // 최소 이동 거리 기준

  const handleTouchStart = (
    swiper: SwiperClass,
    event: TouchEvent | MouseEvent | PointerEvent,
  ) => {
    if ('touches' in event && event.touches.length > 0) {
      setSwiperScrollInfo({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      });
    } else if ('clientX' in event) {
      setSwiperScrollInfo({ x: event.clientX, y: event.clientY });
    }
  };

  const handleTouchMove = (
    swiper: SwiperClass,
    event: TouchEvent | MouseEvent | PointerEvent,
  ) => {
    if (!swiperScrollInfo) return;

    let moveX = 0;
    let moveY = 0;

    if ('touches' in event && event.touches.length > 0) {
      moveX = event.touches[0].clientX;
      moveY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      moveX = event.clientX;
      moveY = event.clientY;
    }

    const deltaX = moveX - swiperScrollInfo.x;
    const deltaY = moveY - swiperScrollInfo.y;

    let gradient = Math.abs(deltaY) / Math.abs(deltaX);
    gradient = gradient === Infinity ? 1000 : gradient;

    // 스크롤 방향 판별 (기울기 비교)
    if (
      gradient <= 7 / 6 ||
      Math.abs(deltaX) > deltaY ||
      Math.abs(deltaX) >= SCROLL_THRESHOLD ||
      deltaY < -SCROLL_THRESHOLD
    ) {
      setPostExternelEventInfo((prev) => ({
        ...prev,
        isActiveSideScroll: true,
      }));
    } else {
      setPostExternelEventInfo((prev) => ({
        ...prev,
        isActiveSideScroll: false,
      }));
    }
  };
  const handleTouchEnd = () => {
    setSwiperScrollInfo(null);

    setPostExternelEventInfo((prev) => ({
      ...prev,
      isActiveSideScroll: false,
    }));
  };

  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, initTimer);
  }, []);

  return (
    <>
      <PostImageWrap style={PostImageWrapStyle}>
        {init ? (
          <StyledSwiper
            spaceBetween={20}
            pagination={true}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            loop={snsPost.postContents.length > 1}
            modules={[Pagination, Navigation, FreeMode, Navigation, Thumbs]}
          >
            {snsPost?.postContents.length > 1 &&
              snsPost?.postContents.map((value, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    onClick={() => {
                      setPostContentZoomPopupInfo((prev) => ({
                        ...prev,
                        isActive: true,
                        initIndex: index,
                        postContents: snsPost.postContents,
                      }));
                    }}
                  >
                    {value.postContentType === POST_IMAGE_TYPE && (
                      <PostImgWrap>
                        <PostImgDiv src={value.content} />
                      </PostImgWrap>
                    )}
                  </SwiperSlide>
                );
              })}
            {snsPost?.postContents.length == 1 && (
              <PostContentFrame
                onClick={() => {
                  if (
                    snsPost?.postContents[0].postContentType === POST_VIDEO_TYPE
                  )
                    return;
                  setPostContentZoomPopupInfo((prev) => ({
                    ...prev,
                    isActive: true,
                    initIndex: 0,
                    postContents: snsPost.postContents,
                  }));
                }}
              >
                {snsPost?.postContents[0].postContentType ===
                  POST_IMAGE_TYPE && (
                  <PostImgBySingle src={snsPost?.postContents[0].content} />
                )}

                {snsPost?.postContents[0].postContentType ===
                  POST_VIDEO_TYPE && (
                  <Suspense
                    fallback={
                      <Skeleton height={400} style={{ borderRadius: '20px' }} />
                    }
                  >
                    <PostVideoContentElementV3
                      postId={postId}
                      videoSrc={snsPost?.postContents[0].content}
                      posterImg={snsPost?.postContents[0].previewImg}
                      isUploaded={snsPost?.postContents[0].isUploaded}
                      isClose={postExternelEventInfo.isClosePost}
                      onClose={() => {
                        setPostExternelEventInfo((prev) => ({
                          ...prev,
                          isClosePost: false,
                        }));
                      }}
                      actionPopupTopScrollByMoveSeekBar={(
                        isActive: boolean,
                      ) => {
                        setPostExternelEventInfo((prev) => ({
                          ...prev,
                          isActiveSideScroll: isActive,
                        }));
                      }}
                      PostVideoStyle={
                        windowWidthSize < MEDIA_MOBILE_MAX_WIDTH_NUM
                          ? {
                              borderRadius: `${PostContentRadis} ${PostContentRadis} 0 0`,
                            }
                          : {}
                      }
                      PostVideoPosterImgStyle={
                        windowWidthSize < MEDIA_MOBILE_MAX_WIDTH_NUM
                          ? {
                              borderRadius: `${PostContentRadis} ${PostContentRadis} 0 0`,
                            }
                          : { borderRadius: `${PostContentRadis}` }
                      }
                    />
                  </Suspense>
                )}
              </PostContentFrame>
            )}
          </StyledSwiper>
        ) : (
          <Skeleton height={400} style={{ borderRadius: '20px' }} />
        )}
      </PostImageWrap>
    </>
  );
};

const ImageBorderRadius = '20px';
const PostContentRadis = '30px';

const PostContentFrame = styled.div`
  width: 100%;
`;

const PostImgBySingle = styled.img`
  width: 100%;
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${PostContentRadis} ${PostContentRadis} 0px 0px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${ImageBorderRadius};
  }
`;

const PostMinHeight = 500;
const PostImgWrap = styled(PostContentFrame)`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-height: ${PostMinHeight}px;
    aspect-ratio: 1 / 1;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    aspect-ratio: 1 / 1.2;
  }
`;

const PostImgDiv = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: ${PostContentRadis} ${PostContentRadis} 0px 0px;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${PostContentRadis} ${PostContentRadis} 0px 0px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${ImageBorderRadius};
  }
`;

const PostImageWrap = styled.div`
  position: relative;
`;

const StyledSwiper = styled(Swiper)`
  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.mainColor.White};
    opacity: 0.3;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.mainColor.White};
    opacity: 1;
  }
`;

export default ProfilePostDetailBodySwiper;
