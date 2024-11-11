import { ReactComponent as LocationSmallIcon } from 'assets/images/icon/svg/LocationSmallIcon.svg';
import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import PostSettingButton from 'components/common/buttton/PostSettingButton';
import SystemSnsPostState from 'components/common/state/SystemSnsPostState';
import ScrapViewPopup from 'components/popups/ScrapViewPopup';
import SnsSharePopup from 'components/popups/SnsSharePopup';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';
import { SERVER_PATH } from 'const/SystemAttrConst';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isPostDetailInfoPopupAtom,
  postDetailInfoPopupAtom,
  PostRspDefaultValue,
} from 'states/PostAtom';
import { isActiveScrapViewPopupByMasonryAtom } from 'states/ProfileAtom';
import { isSharePopupAtom } from 'states/ShareAtom';
import styled from 'styled-components';
import { MasonryPostRsp, PostRsp } from '../../global/interface/post';
import { getHiddenPostIdList } from '../../global/util/HiddenPostIdListUtil';

interface SnsPostMasonryLayoutProps {
  snsPostList: PostRsp[];
  isActiveNavToPost?: boolean;
  actionFuncByRef?: (value: HTMLImageElement | HTMLVideoElement) => void;
  longPressToResizeNum?: number;
  SnsPostMasonryLayoutStyle?: React.CSSProperties;
}

const SnsPostMasonryLayout: React.FC<SnsPostMasonryLayoutProps> = ({
  snsPostList,
  isActiveNavToPost = true,
  actionFuncByRef,
  longPressToResizeNum,
  SnsPostMasonryLayoutStyle,
}) => {
  const navigate = useNavigate();

  const [selectPostRsp, setSelectPostRsp] =
    useState<PostRsp>(PostRspDefaultValue);

  const setPostDetailInfo = useSetRecoilState(postDetailInfoPopupAtom);
  const setIsPostDetailInfoPopup = useSetRecoilState(isPostDetailInfoPopupAtom);

  const mansoryContentClass = 'masnory-content';
  const containerRef = useRef<HTMLDivElement>(null);

  const [hiddenPostIdList, setHiddenPostIdList] = useState<string[]>(
    getHiddenPostIdList(),
  );
  const [isSharePopup, setIsSharePopup] = useRecoilState(isSharePopupAtom);
  const [isActiveScrapViewPopupByMasonry, setIsActiveScrapViewPopupByMasonry] =
    useRecoilState(isActiveScrapViewPopupByMasonryAtom);

  // 이미지 및 비디오의 ref 리스트 관리
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const masonryLayout = () => {
    if (!containerRef.current) return;

    const masonryContainerStyle = getComputedStyle(containerRef.current);

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
            pseudoImg.scrollHeight / autoRows + VerticalMarginGap / autoRows,
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
    <>
      <MasonryContainer ref={containerRef} style={SnsPostMasonryLayoutStyle}>
        {snsPostList.map((v, index) => {
          const postContent = v.postContents[0];

          const masonryPostRsp: MasonryPostRsp = {
            postId: v.postId,
            userId: v.userId,
            postContent: postContent.content,
            postContentType: postContent.postContentType,
            username: v.username,
            location: v.location,
          };
          return (
            <MasonryItem className="masonry-item" key={index}>
              {!hiddenPostIdList.includes(v.postId) && (
                <PostWrap className={mansoryContentClass}>
                  <LongPressToResizeButton
                    resize={longPressToResizeNum || 0.94}
                  >
                    <PostImgAddressWrap
                      $hasAddress={isValidString(v.location.address)}
                      onClick={() => {
                        if (!isActiveNavToPost) return;

                        navigate(`/${v.username}/${v.postId}`);
                        //@REFER: 일단 url로 이동하는 걸로
                        // if (window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM) {
                        //   // 데스크탑 크기
                        //   // url로 이동
                        //   navigate(`/${v.username}/${v.postId}`, {
                        //     state: { isDetailPopup: true },
                        //   });
                        // } else {
                        //   // 모바일 크기
                        //   // url만 바뀌도록 변경
                        //   window.history.pushState(
                        //     null,
                        //     '',
                        //     `/${v.username}/${v.postId}`,
                        //   );
                        //   setIsPostDetailInfoPopup(true);
                        //   setPostDetailInfo({
                        //     postId: v.postId,
                        //     userId: v.username,
                        //   });
                        // }
                      }}
                    >
                      {masonryPostRsp.postContentType === POST_IMAGE_TYPE && (
                        <PostContentImg
                          src={masonryPostRsp.postContent}
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
                      {masonryPostRsp.postContentType === POST_VIDEO_TYPE && (
                        <PostContentVideo
                          autoPlay
                          muted
                          loop
                          playsInline
                          webkit-playsinline="true"
                          src={masonryPostRsp.postContent}
                          onLoadedData={masonryLayout}
                          ref={(el) => (videoRefs.current[index] = el)}
                          crossOrigin={'anonymous'}
                          onClick={() => {
                            const videoRef = videoRefs.current[index];
                            if (actionFuncByRef && videoRef) {
                              actionFuncByRef(videoRef);
                            }
                          }}
                        />
                      )}

                      {v.location.address && (
                        <PostAddressWrap>
                          <PostAddressSubWrap>
                            <LocationSmallIconWrap>
                              <LocationSmallIcon />
                            </LocationSmallIconWrap>
                            <PostAddress>{v.location.address}</PostAddress>
                          </PostAddressSubWrap>
                        </PostAddressWrap>
                      )}
                    </PostImgAddressWrap>
                  </LongPressToResizeButton>
                  <PostSettingButton
                    masonryPostRsp={masonryPostRsp}
                    setSelectPostRsp={setSelectPostRsp}
                    snsPostRsp={v}
                  />
                </PostWrap>
              )}
            </MasonryItem>
          );
        })}
      </MasonryContainer>
      {isSharePopup && (
        <SnsSharePopup
          shareLink={`${SERVER_PATH}/${selectPostRsp.username}/${selectPostRsp.postId}`}
          setIsSharePopup={setIsSharePopup}
        />
      )}
      {isActiveScrapViewPopupByMasonry &&
        isValidString(selectPostRsp.postId) &&
        isValidString(selectPostRsp.postContents[0].content) &&
        isValidString(selectPostRsp.postContents[0].content) && (
          <ScrapViewPopup
            postId={selectPostRsp.postId}
            postContentUrl={selectPostRsp.postContents[0].content}
            postContentType={selectPostRsp.postContents[0].postContentType}
            snsPost={selectPostRsp}
            setSnsPost={setSelectPostRsp}
            setIsActiveScrapViewPopup={setIsActiveScrapViewPopupByMasonry}
          />
        )}
      <SystemSnsPostState postRsp={selectPostRsp} />
    </>
  );
};

const ContentBorderRadius = 22;

const VerticalMarginGap = 5;

const MasonryContainer = styled.div`
  --gap: 10px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
  column-gap: var(--gap);
  grid-auto-rows: 10px;

  min-height: 90vh;
  padding: 0 6px;
`;

const MasonryItem = styled.div`
  margin-bottom: ${VerticalMarginGap}px;
  // @media (hover: hover) and (pointer: fine) {
  //   &:hover {
  //     filter: brightness(0.7);
  //   }
  // }
`;

const PostWrap = styled.div``;

const PostImgAddressWrap = styled.div<{ $hasAddress: boolean }>`
  position: relative;
  cursor: pointer;

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
    border-radius: 0 0 ${ContentBorderRadius}px ${ContentBorderRadius}px;
  }`}
`;

const PostContentImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: ${ContentBorderRadius}px;
  vertical-align: bottom;
`;

const PostContentVideo = styled.video`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: ${ContentBorderRadius}px;
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

export default SnsPostMasonryLayout;
