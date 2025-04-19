import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';

import styled from 'styled-components';
import 'swiper/css';

import 'react-loading-skeleton/dist/skeleton.css';
import PrevButtonHeaderHeader from '../../../components/layouts/PrevButtonHeaderHeader';
import { POST_VIDEO_TYPE } from '../../../const/PostContentTypeConst';
import { removePostByHiddenPostIdList } from '../../../global/util/HiddenPostIdListUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import {
  activePostComplaintCompletePopupAtom,
  activePostComplaintPopupAtom,
  isSettingPopupAtom,
  postContentZoomPopupInfoAtom,
  postExternelEventInfoAtom,
} from '../../../states/PostAtom';
import { isPostReactionAtom } from '../../../states/PostReactionAtom';
import {
  activeProfileBlockPopupInfoAtom,
  activeScrapViewPopupInfoAtom,
} from '../../../states/ProfileAtom';

import PostCotentZoomPopup from 'components/popups/postzoom/PostContentZoomPopup';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { postPostInterested } from 'services/post/postPostInterested';
import 'swiper/css/pagination';

import { ReactComponent as PostPreButtonIcon } from 'assets/images/icon/svg/profilepost/PostPreButtonIcon.svg';
import { ReactComponent as ProfilePostSettingButtonIcon } from 'assets/images/icon/svg/profilepost/ProfilePostSettingButtonIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';

import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import { POST_RELATION_SEARCH_TYPE } from 'const/PostConst';
import { PostRsp } from 'global/interface/post';
import Skeleton from 'react-loading-skeleton';
import { borderShadowStyle_prop } from 'styles/commonStyles';

const ProfilePostDetailBodySwiper = React.lazy(
  () => import('./ProfilePostDetailBodySwiper'),
);

const PostTextContent = React.lazy(
  () => import('components/common/posts/body/PostTextContent'),
);
const PostReactionSingleElement = React.lazy(
  () => import('components/common/posts/body/PostReactionSingleElement'),
);

const ProfilePostDetailBodyProfileInfo = React.lazy(
  () => import('components/post/profilepost/ProfilePostDetailBodyProfileInfo'),
);

const ProfilePostDetailBodyRelation = React.lazy(
  () => import('components/post/profilepost/ProfilePostDetailBodyRelation'),
);

interface ProfilePostDetailBodyProps {
  postId: string;
  snsPost: PostRsp;
  isIntereset: boolean;
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  windowWidthSize: number;
  funcPrevCloseButton: () => void;
  fixNum?: number;
  ProfilePostWrapStyle?: React.CSSProperties;
  PostImageWrapStyle?: React.CSSProperties;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  isErrorProfilePost: boolean;
  searchType?: POST_RELATION_SEARCH_TYPE;
}

const ProfilePostDetailBody: React.FC<ProfilePostDetailBodyProps> = ({
  postId,
  snsPost,
  isIntereset,
  setIsInterest,
  windowWidthSize,
  funcPrevCloseButton,
  fixNum,
  ProfilePostWrapStyle,
  PostImageWrapStyle,
  linkPopupInfo = {
    isLinkPopup: false,
    isReplaced: false,
  },
  isErrorProfilePost,
  searchType,
}) => {
  const postSettingButtonRef = useRef<HTMLDivElement>(null);

  const [isSettingActive, setIsSettingActive] =
    useRecoilState(isSettingPopupAtom);

  const setIsPostReactionPopup = useSetRecoilState(isPostReactionAtom);

  const resetActiveScrapViewPopupInfo = useResetRecoilState(
    activeScrapViewPopupInfoAtom,
  );
  const setActiveProfileBlockInfo = useSetRecoilState(
    activeProfileBlockPopupInfoAtom,
  );

  const resetActivePostComplaintPopup = useResetRecoilState(
    activePostComplaintPopupAtom,
  );
  const resetActivePostComplaintCompletePopup = useResetRecoilState(
    activePostComplaintCompletePopupAtom,
  );

  const postContentZoomPopupInfo = useRecoilValue(postContentZoomPopupInfoAtom);

  useEffect(() => {
    return () => {
      setIsPostReactionPopup(false);
      resetActiveScrapViewPopupInfo();
      setActiveProfileBlockInfo({ isActive: false, userId: '', username: '' });
      resetActivePostComplaintPopup();
      resetActivePostComplaintCompletePopup();
    };
  }, []);

  const onClickSettingButton = () => {
    setIsSettingActive(true);
  };

  const onClickPostInterest = () => {
    if (postId && isValidString(postId)) {
      postPostInterested(postId).then((value) => {
        setIsInterest(value.isInterested);
        removePostByHiddenPostIdList(postId);
      });
    }
  };

  // 포스트 게시물 영역 보이는 지

  const elementRef = useRef<HTMLDivElement>(null);

  // const [isReadyToRenderSwiper, setIsReadyToRenderSwiper] = useState(false);
  const [isInitByPostText, setIsInitByPostText] = useState(false);

  const timerRefList = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      // requestIdleCallback(() => setIsReadyToRenderSwiper(true), {
      //   timeout: 600,
      // });
      requestIdleCallback(() => setIsInitByPostText(true), {
        timeout: 800,
      });
    } else {
      // timerRefList.current.push(
      //   setTimeout(() => {
      //     setIsReadyToRenderSwiper(true);
      //   }, 600),
      // );
      timerRefList.current.push(
        setTimeout(() => {
          setIsInitByPostText(true);
        }, 800),
      );
    }

    return () => {
      timerRefList.current.forEach((v) => clearTimeout(v));
    };
  }, []);

  useEffect(() => {
    return () => {
      resetPostExternelEventInfo();
    };
  }, [postId]);

  const setPostExternelEventInfo = useSetRecoilState(postExternelEventInfoAtom);
  const resetPostExternelEventInfo = useResetRecoilState(
    postExternelEventInfoAtom,
  );

  return (
    <>
      <ProfilePostContainer>
        <div ref={elementRef}>
          {isIntereset && !isErrorProfilePost && (
            <ProfilePostWrap style={ProfilePostWrapStyle}>
              <PostPreButtonWrap>
                <PostPreButton
                  onClick={() => {
                    funcPrevCloseButton();
                  }}
                >
                  <StylePostPreButtonIcon />
                </PostPreButton>
              </PostPreButtonWrap>
              <SettingButtonWrap>
                <SettingButton
                  onClick={onClickSettingButton}
                  ref={postSettingButtonRef}
                >
                  <StyleProfilePostSettingButtonIcon />
                  {windowWidthSize > MEDIA_MOBILE_MAX_WIDTH_NUM &&
                    postId &&
                    postSettingButtonRef.current &&
                    isSettingActive && (
                      <ContextMenuPopup
                        onClose={() => setIsSettingActive(false)}
                        contextMenuRef={postSettingButtonRef.current}
                      >
                        <ProfilePostSettingBody
                          postId={postId}
                          type={
                            snsPost.postContents.some(
                              (v) => v.postContentType === POST_VIDEO_TYPE,
                            )
                              ? 'video'
                              : 'image'
                          }
                          onClose={() => setIsSettingActive(false)}
                          userId={snsPost.userId}
                          username={snsPost.username}
                          setIsInterest={setIsInterest}
                          ProfilePostSettingBodyStyle={{
                            padding: '20px 0px',
                          }}
                        />
                      </ContextMenuPopup>
                    )}
                </SettingButton>
              </SettingButtonWrap>

              <Suspense
                fallback={<Skeleton height={400} style={PostImageWrapStyle} />}
              >
                <ProfilePostDetailBodySwiper
                  postId={postId}
                  snsPost={snsPost}
                  windowWidthSize={windowWidthSize}
                  PostImageWrapStyle={PostImageWrapStyle}
                />
              </Suspense>

              <PostContentContainer>
                {postId && (
                  <>
                    <Suspense fallback={<Skeleton height={70} />}>
                      <ProfilePostDetailBodyProfileInfo
                        postId={postId}
                        snsPost={snsPost}
                        windowWidthSize={windowWidthSize}
                      />
                    </Suspense>
                  </>
                )}
                {postId && (
                  <>
                    <Suspense fallback={<Skeleton />}>
                      <PostReactionSingleElement
                        username={snsPost.username}
                        postId={snsPost.postId}
                        snsPost={snsPost}
                        onClickCloseVideo={() => {
                          setPostExternelEventInfo((prev) => ({
                            ...prev,
                            isClosePost: true,
                          }));
                        }}
                      />
                    </Suspense>
                  </>
                )}

                {isInitByPostText ? (
                  <Suspense
                    fallback={
                      <Skeleton count={3} style={{ marginBottom: 5 }} />
                    }
                  >
                    <PostTextContent
                      postTitle={snsPost.postTitle}
                      postBodyText={snsPost.postBodyText}
                      postedAt={snsPost.postedAt}
                      tags={snsPost.tags}
                      isExpandedBodyText={false}
                    />
                  </Suspense>
                ) : (
                  <Skeleton count={3} style={{ marginBottom: 5 }} />
                )}
              </PostContentContainer>
            </ProfilePostWrap>
          )}

          {!isErrorProfilePost && !isIntereset && (
            <>
              <PrevButtonHeaderHeader
                titleName=""
                HeaderLayoutStyle={PreButtonHeaderStyle}
              />
              <HiddenWrap>
                <NotInerestedMessageWrap>
                  <NotInerestedMessage>
                    <div>이 게시물을 숨겼습니다.</div>
                    <NotInerestedCancelButtonWrap>
                      <NotInerestedCancelButton onClick={onClickPostInterest}>
                        취소
                      </NotInerestedCancelButton>
                    </NotInerestedCancelButtonWrap>
                  </NotInerestedMessage>
                </NotInerestedMessageWrap>
              </HiddenWrap>
            </>
          )}
          {isErrorProfilePost && (
            <>
              <PrevButtonHeaderHeader
                titleName=""
                HeaderLayoutStyle={PreButtonHeaderStyle}
              />
            </>
          )}
        </div>
        <BoundaryBarStick />
        <Suspense fallback={<Skeleton count={3} />}>
          <ProfilePostDetailBodyRelation
            postId={postId}
            snsPost={snsPost}
            windowWidthSize={windowWidthSize}
            fixNum={fixNum}
            linkPopupInfo={linkPopupInfo}
            searchType={searchType}
          />
        </Suspense>
      </ProfilePostContainer>

      {postContentZoomPopupInfo.isActive && <PostCotentZoomPopup />}
    </>
  );
};

const ImageBorderRadius = '20px';

const ProfilePostContainer = styled.div``;

const ProfilePostWrap = styled.div`
  padding-top: env(safe-area-inset-top);
  position: relative;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) =>
      theme.systemSize.appDisplaySize.profilePostMaxWidth};
    box-shadow: ${borderShadowStyle_prop};
    border-radius: ${ImageBorderRadius};
    margin: 10px auto 15px auto;
    padding: 0px 10px 10px 10px;
  }
`;

const HiddenWrap = styled.div`
  padding-top: env(safe-area-inset-top);
`;

const PostContentContainer = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding: 15px
      ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 0
      ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding: 15px 5px 0 5px;
  }
`;

const BoundaryBarStick = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey1};
  height: 1px;
`;

const SettingButtonWrap = styled.div`
  position: absolute;
  z-index: 1010;
  cursor: pointer;
  right: 0px;
`;

const SettingButton = styled.div`
  position: relative;
  padding: 15px;
`;

const NotInerestedMessageWrap = styled.div`
  display: flex;
  flex-flow: column;
  background-color: ${({ theme }) => theme.grey.Grey1};
  padding: 19px 23px;
  border-radius: 8px;
  margin: 0px 10px 10px 10px;
`;
const NotInerestedMessage = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey6};
`;
const NotInerestedCancelButtonWrap = styled.div`
  display: flex;
  justify-content: end;
`;
const NotInerestedCancelButton = styled.div`
  cursor: pointer;
`;

const PreButtonHeaderStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
};

const PostPreButtonWrap = styled.div`
  position: fixed;
  z-index: 1010;
`;

const PostPreButton = styled.div`
  position: fixed;
  cursor: pointer;
  padding: 15px;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-left: 5px;
  }
`;

const StylePostPreButtonIcon = styled(PostPreButtonIcon)`
  vertical-align: bottom;
`;

const StyleProfilePostSettingButtonIcon = styled(ProfilePostSettingButtonIcon)`
  vertical-align: bottom;
`;

export default ProfilePostDetailBody;
