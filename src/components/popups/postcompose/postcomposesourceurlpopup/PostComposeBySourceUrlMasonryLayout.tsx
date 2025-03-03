import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MasonryPostRsp } from '../../../../global/interface/post';

interface PostComposeBySourceUrlMasonryLayoutProps {
  snsPostUrlList: MasonryPostRsp[];
  actionFuncByRef: (value: HTMLImageElement | HTMLVideoElement) => void;
  longPressToResizeNum?: number;
  MasonryContainerStyle?: React.CSSProperties;
}

const PostComposeBySourceUrlMasonryLayout: React.FC<
  PostComposeBySourceUrlMasonryLayoutProps
> = ({
  snsPostUrlList,
  actionFuncByRef,
  longPressToResizeNum,
  MasonryContainerStyle,
}) => {
  const mansoryContentClass = 'masnory-content';
  const containerRef = useRef<HTMLDivElement>(null);

  // 이미지 및 비디오의 ref 리스트 관리
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const PostComposeBySourceUrlMasonryLayout = () => {
    if (!containerRef.current) return;

    const masonryContainerStyle = getComputedStyle(containerRef.current);
    const columnGap = parseInt(
      masonryContainerStyle.getPropertyValue('column-gap'),
    );
    const autoRows = parseInt(
      masonryContainerStyle.getPropertyValue('grid-auto-rows'),
    );

    containerRef.current
      .querySelectorAll<HTMLDivElement>('.masonry-item')
      .forEach((elt) => {
        const pseudoImg = elt.querySelector<HTMLImageElement>(
          `.${mansoryContentClass}`,
        );

        if (pseudoImg) {
          elt.style.gridRowEnd = `span ${Math.ceil(
            pseudoImg.scrollHeight / autoRows + columnGap / autoRows,
          )}`;
        }
      });
  };

  useEffect(() => {
    PostComposeBySourceUrlMasonryLayout();
    window.addEventListener('resize', PostComposeBySourceUrlMasonryLayout);
    return () =>
      window.removeEventListener('resize', PostComposeBySourceUrlMasonryLayout);
  }, []);

  return (
    <>
      <MasonryContainer ref={containerRef} style={MasonryContainerStyle}>
        {snsPostUrlList.map((v, index) => {
          return (
            <MasonryItem className="masonry-item" key={index}>
              <PostWrap className={mansoryContentClass}>
                <LongPressToResizeButton resize={longPressToResizeNum || 0.94}>
                  <PostImgAddressWrap
                    $hasAddress={isValidString(v.location.address)}
                  >
                    {v.postContentType === POST_IMAGE_TYPE && (
                      <PostContentImg
                        src={v.postContent}
                        onLoad={PostComposeBySourceUrlMasonryLayout}
                        ref={(el) => (imageRefs.current[index] = el)}
                        onClick={() => {
                          const imageRef = imageRefs.current[index];
                          if (!imageRef) return;

                          actionFuncByRef(imageRef);
                        }}
                      />
                    )}
                    {v.postContentType === POST_VIDEO_TYPE && (
                      <PostContentVideo
                        autoPlay
                        muted
                        loop
                        playsInline
                        webkit-playsinline="true"
                        src={v.postContent}
                        onLoadedData={PostComposeBySourceUrlMasonryLayout}
                        ref={(el) => (videoRefs.current[index] = el)}
                        onClick={() => {
                          const videoRef = videoRefs.current[index];
                          if (actionFuncByRef && videoRef) {
                            actionFuncByRef(videoRef);
                          }
                        }}
                      />
                    )}
                  </PostImgAddressWrap>
                </LongPressToResizeButton>
              </PostWrap>
            </MasonryItem>
          );
        })}
      </MasonryContainer>
    </>
  );
};

const ContentBorderRadius = 22;

const MasonryContainer = styled.div`
  --gap: 10px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
  column-gap: var(--gap);
  grid-auto-rows: 10px;

  padding: 0 6px;
`;

const MasonryItem = styled.div`
  margin-bottom: var(--gap);
`;

const PostWrap = styled.div``;

const PostImgAddressWrap = styled.div<{ $hasAddress: boolean }>`
  position: relative;

  ${(props) =>
    props.$hasAddress &&
    `&::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%; /* 그라데이션 높이 조절 */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
    border-radius: ${ContentBorderRadius}px;
  }`}
`;

const PostContentImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 22px;
  vertical-align: bottom;
  background-color: hsl(0, 0%, 97%);
`;

const PostContentVideo = styled.video`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 22px;
  vertical-align: bottom;
`;

const PostAddressWrap = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 10;
`;

const PostAddressSubWrap = styled.div`
  display: flex;
  gap: 2px;
  padding: 0 0 9px 8px;
`;

const PostAddress = styled.div`
  font: ${({ theme }) => theme.fontSizes.BoxText};
  color: ${({ theme }) => theme.mainColor.White};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LocationSmallIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

export default PostComposeBySourceUrlMasonryLayout;
