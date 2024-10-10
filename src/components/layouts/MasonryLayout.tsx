import { ReactComponent as LocationSmallIcon } from 'assets/images/icon/svg/LocationSmallIcon.svg';
import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  isPostDetailInfoPopupAtom,
  postDetailInfoPopupAtom,
} from 'states/PostAtom';
import styled from 'styled-components';
import { MasonryPostRsp } from '../../global/interface/post';
import { getHiddenPostIdList } from '../../global/util/HiddenPostIdListUtil';

interface MasonryLayoutProps {
  snsPostUrlList: MasonryPostRsp[];
  isActiveNavToPost?: boolean;
  actionFuncByRef?: (value: HTMLImageElement | HTMLVideoElement) => void;
  longPressToResizeNum?: number;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  snsPostUrlList,
  isActiveNavToPost = true,
  actionFuncByRef,
  longPressToResizeNum,
}) => {
  const navigate = useNavigate();

  const setPostDetailInfo = useSetRecoilState(postDetailInfoPopupAtom);
  const setIsPostDetailInfoPopup = useSetRecoilState(isPostDetailInfoPopupAtom);

  const mansoryContentClass = 'masnory-content';
  const containerRef = useRef<HTMLDivElement>(null);

  const [hiddenPostIdList, setHiddenPostIdList] = useState<string[]>(
    getHiddenPostIdList(),
  );

  // 이미지 및 비디오의 ref 리스트 관리
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const masonryLayout = () => {
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
    masonryLayout();
    window.addEventListener('resize', masonryLayout);
    return () => window.removeEventListener('resize', masonryLayout);
  }, []);

  return (
    <MasonryContainer ref={containerRef}>
      {snsPostUrlList.map((v, index) => (
        <MasonryItem className="masonry-item" key={index}>
          {!hiddenPostIdList.includes(v.postId) && (
            <PostWrap
              onClick={() => {
                if (!isActiveNavToPost) return;

                if (window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
                  // 데스크탑 크기
                  // url로 이동
                  navigate(`/${v.username}/${v.postId}`, {
                    state: { isDetailPopup: true },
                  });
                } else {
                  // 모바일 크기
                  // url만 바뀌도록 변경
                  window.history.pushState(
                    null,
                    '',
                    `/${v.username}/${v.postId}`,
                  );
                  setIsPostDetailInfoPopup(true);
                  setPostDetailInfo({
                    postId: v.postId,
                    userId: v.username,
                  });
                }
              }}
            >
              <LongPressToResizeButton resize={longPressToResizeNum || 0.94}>
                <PostImgAddressWrap>
                  {v.postContentType === POST_IMAGE_TYPE && (
                    <PostContentImg
                      className={mansoryContentClass}
                      src={v.postContent}
                      alt={`Image ${index + 1}`}
                      onLoad={masonryLayout}
                      ref={(el) => (imageRefs.current[index] = el)}
                      onClick={() => {
                        const imageRef = imageRefs.current[index];
                        if (actionFuncByRef && imageRef) {
                          actionFuncByRef(imageRef);
                        }
                      }}
                    />
                  )}
                  {v.postContentType === POST_VIDEO_TYPE && (
                    <PostContentVideo
                      autoPlay
                      className={mansoryContentClass}
                      muted
                      loop
                      playsInline
                      webkit-playsinline="true"
                      src={v.postContent}
                      onLoadedData={masonryLayout}
                      ref={(el) => (videoRefs.current[index] = el)}
                      crossOrigin={'anonymous'}
                      onClick={() => {
                        const videoRef = videoRefs.current[index];
                        if (actionFuncByRef && videoRef) {
                          actionFuncByRef(videoRef);
                        }
                      }}
                    ></PostContentVideo>
                  )}

                  {v.location.address && (
                    <PostAddressWrap>
                      <LocationSmallIcon />
                      <PostAddress>{v.location.address}</PostAddress>
                    </PostAddressWrap>
                  )}
                </PostImgAddressWrap>
              </LongPressToResizeButton>
            </PostWrap>
          )}
        </MasonryItem>
      ))}
    </MasonryContainer>
  );
};

const MasonryContainer = styled.div`
  --gap: 10px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
  column-gap: var(--gap);
  grid-auto-rows: 10px;

  margin-bottom: 100px;
  padding: 0 6px;
`;

const MasonryItem = styled.div`
  margin-bottom: var(--gap);
  // @media (hover: hover) and (pointer: fine) {
  //   &:hover {
  //     filter: brightness(0.7);
  //   }
  // }
`;

const PostWrap = styled.div``;

const PostImgAddressWrap = styled.div`
  position: relative;
`;

const PostContentImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 22px;
  vertical-align: bottom;
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
  display: flex;
  padding: 0 0 9px 8px;
`;

const PostAddress = styled.div`
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.mainColor.White};
`;

export default MasonryLayout;
