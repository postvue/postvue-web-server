import PostImagePreviewElement from 'components/common/posts/element/PostImagePreviewElement';
import { POST_IMAGE_TYPE, POST_VIDEO_TYPE } from 'const/PostContentTypeConst';

import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import React, { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { postRspAtom } from 'states/PostAtom';

import PostVideoPreviewElement from 'components/common/posts/element/PostVideoPreviewElement';
import { POST_RELATION_SEARCH_TYPE } from 'const/PostConst';
import { SEARCH_TYPE_PARAM } from 'services/appApiQueryParam';
import styled from 'styled-components';
import { MasonryPostRsp, PostRsp } from '../../global/interface/post';
import { getHiddenPostIdList } from '../../global/util/HiddenPostIdListUtil';
import MasonryLayout from './masonry/MasonryLayout';

interface SnsPostMasonryLayoutProps {
  snsPostList: PostRsp[];
  isActiveNavToPost?: boolean;
  actionFuncByRef?: (value: HTMLImageElement | HTMLVideoElement) => void;
  longPressToResizeNum?: number;
  SnsPostMasonryLayoutStyle?: React.CSSProperties;
  isAutoPlay?: boolean;
  fixNum?: number;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  actionFunc?: () => void;
  scrapId?: string;
  searchType?: POST_RELATION_SEARCH_TYPE;
}

const SnsPostMasonryLayout: React.FC<SnsPostMasonryLayoutProps> = ({
  snsPostList,
  isActiveNavToPost = true,
  actionFuncByRef,
  longPressToResizeNum,
  SnsPostMasonryLayoutStyle,
  isAutoPlay = true,
  fixNum,
  linkPopupInfo = {
    isLinkPopup: false,
    isReplaced: false,
  },
  actionFunc,
  scrapId,
  searchType,
}) => {
  const navigate = useNavigate();

  const setSnsPost = useSetRecoilState(postRspAtom);

  const [hiddenPostIdList, setHiddenPostIdList] = useState<string[]>(
    getHiddenPostIdList(),
  );

  const [errorPostIds, setErrorPostIds] = useState<Set<string>>(new Set());

  const handleImageError = (postId: string) => {
    setErrorPostIds((prev) => new Set(prev).add(postId));
  };

  const handleVideoError = (postId: string) => {
    setErrorPostIds((prev) => new Set(prev).add(postId));
  };

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handleVideoPlay = (postId: string) => {
    // 비디오가 화면에 보이면 해당 비디오만 재생하고, 다른 비디오는 멈춤
    setActiveVideoId(postId);
  };

  const handleVideoPause = (postId: string) => {
    // 비디오가 화면에서 벗어나면 재생 중지
    if (activeVideoId === postId) {
      setActiveVideoId(null);
    }
  };

  return (
    <>
      <MasonryLayout
        MasonryLayoutStyle={SnsPostMasonryLayoutStyle}
        fetchMoreOption={{
          dataLength: snsPostList.length,
          threshold: 200, // optional prop
          customLoader: <div style={{ textAlign: 'center' }} />, // optional prop
        }}
        fixNum={fixNum}
      >
        {snsPostList.map((v, index) => {
          const postContent = v.postContents[0];

          const masonryPostRsp: MasonryPostRsp = {
            postId: v.postId,
            userId: v.userId,
            postContent: postContent.content,
            postContentType: postContent.postContentType,
            username: v.username,
            location: v.location,
            previewImg: postContent.previewImg,
            videoDuration: postContent.videoDuration,
            isUploaded: postContent.isUploaded,
          };

          return (
            <MasonryItem key={index}>
              {!hiddenPostIdList.includes(v.postId) && (
                <PostWrap>
                  <PostImgAddressWrap
                    onClick={() => {
                      if (!isActiveNavToPost) return;

                      setSnsPost(v);
                      if (
                        window.innerWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ||
                        linkPopupInfo.isLinkPopup
                      ) {
                        // 모바일 크기
                        // url만 바뀌도록 변경

                        const searchParams = new URLSearchParams(
                          location.search,
                        );

                        // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
                        searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
                        searchParams.set(POST_DETAIL_POST_ID_PARAM, v.postId);
                        searchParams.set(POST_DETAIL_PROFILE_PARAM, v.username);

                        // 새로운 쿼리 파라미터가 포함된 URL 생성
                        const newSearch = searchParams.toString();
                        const newPath =
                          `${location.pathname}?${newSearch}` +
                          (searchType
                            ? `&${SEARCH_TYPE_PARAM}=${searchType}`
                            : '');

                        navigate(newPath, {
                          replace: linkPopupInfo.isReplaced,
                          state: { isDetailPopup: true },
                        });
                        // setIsPostDetailInfoPopup(true);
                        // setPostDetailInfo({
                        //   postId: v.postId,
                        //   userId: v.username,
                        // });
                      } else {
                        // 데스크탑 크기
                        // url로 이동

                        navigate(
                          generatePath(PROFILE_POST_LIST_PATH, {
                            user_id: v.username,
                            post_id: v.postId,
                          }),
                          {
                            state: { isDetailPopup: true },
                          },
                        );
                      }
                      if (actionFunc) {
                        actionFunc();
                      }
                    }}
                  >
                    {masonryPostRsp.postContentType === POST_IMAGE_TYPE && (
                      <PostImagePreviewElement
                        imageSrc={masonryPostRsp.postContent}
                        actionFuncByRef={actionFuncByRef}
                        PostImageStyle={{
                          borderRadius: `${ContentBorderRadius}px`,
                        }}
                        selectPostRsp={v}
                        scrapId={scrapId}
                        onError={() => handleImageError(v.postId)}
                        location={masonryPostRsp.location}
                        ContentBorderRadius={ContentBorderRadius}
                        longPressToResizeNum={longPressToResizeNum}
                      />
                    )}
                    {masonryPostRsp.postContentType === POST_VIDEO_TYPE && (
                      <PostVideoPreviewElement
                        postId={masonryPostRsp.postId}
                        activeVideoId={activeVideoId}
                        onPlay={() => handleVideoPlay(masonryPostRsp.postId)}
                        onPause={() => handleVideoPause(masonryPostRsp.postId)}
                        autoPlayMode={isAutoPlay}
                        videoSrc={masonryPostRsp.postContent}
                        selectPostRsp={v}
                        scrapId={scrapId}
                        location={masonryPostRsp.location}
                        ContentBorderRadius={ContentBorderRadius}
                        longPressToResizeNum={longPressToResizeNum}
                        videoDuration={masonryPostRsp.videoDuration}
                        posterImg={masonryPostRsp.previewImg}
                        actionFuncByRef={actionFuncByRef}
                        PostVideoStyle={{
                          borderRadius: `${ContentBorderRadius}px`,
                          backgroundColor: 'black',
                        }}
                        isVisibilityDetection={true}
                        onError={() => {
                          handleVideoError(v.postId);
                          setActiveVideoId(null);
                        }}
                      />
                    )}

                    {/* {v.location.address && (
                        <PostAddressWrap>
                          <PostAddressSubWrap>
                            <LocationSmallIconWrap>
                              <LocationSmallIcon />
                            </LocationSmallIconWrap>
                            <PostAddress>
                              {v.location.buildName
                                ? v.location.buildName
                                : v.location.address}
                            </PostAddress>
                          </PostAddressSubWrap>
                        </PostAddressWrap>
                      )} */}
                  </PostImgAddressWrap>

                  {/* <PostSettingDotButton selectPostRsp={v} scrapId={scrapId} /> */}
                </PostWrap>
              )}
            </MasonryItem>
          );
        })}
      </MasonryLayout>
    </>
  );
};

const ContentBorderRadius = 22;

const VerticalMarginGap = 5;

const MasonryItem = styled.div`
  margin-bottom: ${VerticalMarginGap}px;
`;

const PostWrap = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
`;

const PostImgAddressWrap = styled.div`
  height: 100%;
`;

const PostAddressWrap = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 10;

  &::after {
    z-index: -1;
    content: '';
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
    border-radius: 0 0 ${ContentBorderRadius}px ${ContentBorderRadius}px;
  }
`;

const PostAddressSubWrap = styled.div`
  display: flex;
  gap: 2px;
  padding: 0 0 9px 8px;
`;

const PostAddress = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    font: ${({ theme }) => theme.fontSizes.Body3};
  }
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
