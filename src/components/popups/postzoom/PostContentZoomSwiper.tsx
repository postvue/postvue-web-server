import { POST_IMAGE_TYPE } from 'const/PostContentTypeConst';
import { PostContentInterface } from 'global/interface/post';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SwiperCore from 'swiper';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import PostZoomImage from './PostZoomImage';

interface PostContentZoomSwiperProps {
  postContents: PostContentInterface[];
  initIndex?: number;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
  isMobile: boolean;
}

const PostContentZooomSwiper: React.FC<PostContentZoomSwiperProps> = ({
  postContents,
  initIndex = 0,
  currentIndex,
  setCurrentIndex,
  isActive,
  isMobile,
}) => {
  const [swiper, setSwiper] = useState<SwiperCore>();
  const [isSwiperEnabled, setIsSwiperEnabled] = useState(true); // Swiper 활성화 상태

  useEffect(() => {
    if (!swiper) return;
    // isActive가 true일 때만 initIndex로 이동
    if (isActive) {
      swiper.slideTo(initIndex);
    } else {
      swiper.slideTo(0, 0); // 기본값으로 리셋
    }
  }, [initIndex, isActive, swiper]); // targetIndex 값이 변경될 때 실행

  useEffect(() => {
    if (!swiper) return;

    swiper.slideTo(currentIndex);
  }, [currentIndex]); // targetIndex 값이 변경될 때 실행

  return (
    <StyledSwiper
      onSwiper={setSwiper}
      spaceBetween={20}
      // slidesPerView={1}
      // loop={postContents.length > 1}
      modules={[Pagination, Navigation, FreeMode, Navigation, Thumbs]}
      onActiveIndexChange={(swiper: SwiperClass) => {
        setCurrentIndex(swiper.realIndex);
      }}
      allowTouchMove={isSwiperEnabled}
    >
      {postContents.map((value, index) => {
        return (
          <SwiperSlide key={index}>
            <PostContentSlideContainer>
              <PostContentSlideWrap>
                <PostContentSlideSubWrap>
                  {value.postContentType === POST_IMAGE_TYPE && (
                    <PostZoomImage
                      src={value.content}
                      isMobile={isMobile}
                      // onSwiperEnabled={(isActive: boolean) => {
                      //   setIsSwiperEnabled(isActive);
                      // }}
                    />
                  )}
                  {/* {value.postContentType === POST_VIDEO_TYPE && (
                    <PostVideoContentELement
                      videoSrc={value.content}
                      posterImg={value.previewImg}
                      isUploaded={value.isUploaded}
                    />
                  )} */}
                </PostContentSlideSubWrap>
              </PostContentSlideWrap>
            </PostContentSlideContainer>
          </SwiperSlide>
        );
      })}
    </StyledSwiper>
  );
};

const StyledSwiper = styled(Swiper)`
  height: 100%;
`;

const PostContentSlideContainer = styled.div`
  display: flex;
  height: 100%;
`;

const PostContentSlideWrap = styled.div`
  margin: auto auto;
`;

const PostContentSlideSubWrap = styled.div``;

const PostImage = styled.img`
  border-radius: 10px;
  background-color: hsl(0, 0%, 97%);
  width: 100%;
  height: 100%;
`;

export default PostContentZooomSwiper;
