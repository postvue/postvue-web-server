import PostVideoContentELement from 'components/common/posts/element/PostVideoContentElement';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useResetRecoilState } from 'recoil';
import { postContentZoomPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';

import { ReactComponent as PostContentZoomExitButtonIcon } from 'assets/images/icon/svg/PostContentZoomExitButtonIcon.svg';
import BodyFixScrollElement from 'components/BodyFixScrollElement';
import { OVERFLOW_DEFAULT, OVERFLOW_HIDDEN } from 'const/AttributeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { PostRsp } from 'global/interface/post';
import { throttle } from 'lodash';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

interface PostCotentZoomPopupProps {
  snsPost: PostRsp;
  initIndex?: number;
}

const PostCotentZoomPopup: React.FC<PostCotentZoomPopupProps> = ({
  snsPost,
  initIndex = 0,
}) => {
  const resetPostContentZoomPopupInfo = useResetRecoilState(
    postContentZoomPopupInfoAtom,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const touchRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    setStartX(e.touches[0].clientX);
    setIsVerticalScroll(false); // 터치 시작 시 방향을 초기화

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleTouchMove = useCallback(
    throttle((e: React.TouchEvent<HTMLDivElement>) => {
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = currentY - startY;
      const deltaX = currentX - startX;

      // 스크롤 방향 결정 (한 번만 설정)
      if (!isVerticalScroll) {
        setIsVerticalScroll(Math.abs(deltaY) > Math.abs(deltaX)); // 수직 이동이 크면 true
      }

      if (isVerticalScroll && deltaY > 0) {
        // 수직 스크롤만 처리
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          setTranslateY(deltaY * 1.5);
        });
      }

      e.preventDefault(); // 터치 이동 이벤트가 부모에게 전파되지 않도록
    }, 16),
    [startY, startX, isVerticalScroll],
  );

  const handleTouchEnd = () => {
    if (translateY > 150) {
      requestAnimationFrame(() => {
        setTranslateY(window.innerHeight);
        setTimeout(() => resetPostContentZoomPopupInfo(), 50);
      });
    } else {
      requestAnimationFrame(() => {
        setTranslateY(0);
      });
    }
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = OVERFLOW_HIDDEN;

    return () => {
      console.log(originalOverflow);
      //@REFER: 참고 바람
      // document.body.style.overflow = originalOverflow;
      document.body.style.overflow = OVERFLOW_DEFAULT;

      resetPostContentZoomPopupInfo();
    };
  }, []);
  return (
    <>
      <PopupOverLayLayoutContainer
        $translateY={translateY}
        onClick={() => resetPostContentZoomPopupInfo()}
      >
        {snsPost.postContents.length > 1 && (
          <CurrentSlidePositionWrap>
            <CurrentSlidePosition>
              {currentIndex}/{snsPost.postContents.length}
            </CurrentSlidePosition>
          </CurrentSlidePositionWrap>
        )}
        <PostZoomExitButtonWrap>
          <PostContentZoomExitButtonIcon />
        </PostZoomExitButtonWrap>
        <PostContentWrap
          $translateY={translateY}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={touchRef}
        >
          <StyledSwiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            modules={[Pagination, Navigation, FreeMode, Navigation, Thumbs]}
            initialSlide={initIndex}
            onActiveIndexChange={(swiper: SwiperClass) => {
              setCurrentIndex(swiper.realIndex + 1);
            }}
          >
            {snsPost?.postContents.map((value, index) => {
              return (
                <StyledSwiperSlide key={index}>
                  <PostContentSlideWrap onClick={(e) => e.stopPropagation()}>
                    {value.postContentType === POST_IMAGE_TYPE && (
                      <PostImage src={value.content} />
                    )}
                    {value.postContentType === POST_VIDEO_TYPE && (
                      <PostVideoContentELement videoSrc={value.content} />
                    )}
                  </PostContentSlideWrap>
                </StyledSwiperSlide>
              );
            })}
          </StyledSwiper>
        </PostContentWrap>
      </PopupOverLayLayoutContainer>
      <BodyFixScrollElement />
    </>
  );
};

const PopupOverLayLayoutContainer = styled.div<{ $translateY: number }>`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background: rgba(
    0,
    0,
    0,
    ${(props) => Math.max(0, 0.95 - props.$translateY / 500)}
  );
`;

const StyledSwiper = styled(Swiper)`
  height: 100%;
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  display: flex;
`;

const PostZoomExitButtonWrap = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  margin: 10px 10px 0 0;
  z-index: 100;
  cursor: pointer;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin: 10px 10px 0 0;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin: 20px 20px 0 0;
  }
`;

const PostContentWrap = styled.div<{ $translateY: number }>`
  height: 100%;
  transform: translate3d(0, ${({ $translateY }) => $translateY}px, 0);
`;

const PostContentSlideWrap = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 100%;
    margin: auto 0;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-height: 700px; //@REFER: 임시로 지정한 값이라 나중에 수정 필요
    margin: auto auto;
    height: 100%;
  }
`;

const PostImage = styled.img`
  border-radius: 10px;
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 100%;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: 100%;
  }
`;

const CurrentSlidePositionWrap = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 100;
`;

const CurrentSlidePosition = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey8};
  color: ${({ theme }) => theme.mainColor.White};
  display: inline-block;
  padding: 5px 8px;
  padding: 3px 7px;
  border-radius: 15px;
  font: ${({ theme }) => theme.fontSizes.Body1};
`;

export default PostCotentZoomPopup;
