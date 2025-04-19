import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import styled from 'styled-components';
import { PROFILE_LIST_PATH } from '../const/PathConst';
import { POST_IMAGE_TYPE } from '../const/PostContentTypeConst';
import { getHiddenPostIdList } from '../global/util/HiddenPostIdListUtil';
import { postRspAtom } from '../states/PostAtom';
import { postReactionTabIdAtom } from '../states/PostReactionAtom';
import theme from '../styles/theme';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import 'swiper/css/pagination';

import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import ToastPopup from 'components/popups/ToastMsgPopup';
import ProfilePostDetailBody from 'components/post/profilepost/ProfilePostDetailBody';
import ProfilePostDetailPopupManager from 'components/post/profilepost/ProfilePostDetailPopupManager';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { COMMENT_CONTAINER_ID } from 'const/IdNameConst';
import { POST_REACTION_COMMENT_ID } from 'const/TabConfigConst';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import {
  isApp,
  sendInitEvent,
  stackRouterBack,
} from 'global/util/reactnative/nativeRouter';
import { getRandomImage } from 'global/util/ShareUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateProfilePost } from 'hook/queryhook/QueryStateProfilePost';
import { initPageInfoAtom } from 'states/SystemConfigAtom';

const PostReactionPopupHeader = React.lazy(
  () =>
    import('components/popups/postreactionpopup/body/PostReactionPopupHeader'),
);

const PostReactionPopupBody = React.lazy(
  () =>
    import('components/popups/postreactionpopup/body/PostReactionPopupBody'),
);

const PostReactionCommentSendElement = React.lazy(
  () =>
    import(
      'components/popups/postreactionpopup/body/PostReactionCommentSendElement'
    ),
);

const AppBaseTemplate = React.lazy(
  () => import('../components/layouts/AppBaseTemplate'),
);

const ProfilePostPage: React.FC = () => {
  const param = useParams();
  const postId = param.post_id;
  const user_id = param.user_id;
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  const resetSnsPost = useResetRecoilState(postRspAtom);

  const reactionTabId = useRecoilValue(postReactionTabIdAtom);

  const hiddenPostIdList = getHiddenPostIdList();
  const [isIntereset, setIsInterest] = useState<boolean>(true);

  const navigate = useNavigate();

  const {
    data: profilePost,
    isError: isErrorByProfilePost,
    error: errorByProfilePost,
  } = QueryStateProfilePost(postId || '', true);

  useEffect(() => {
    if (postId) {
      if (hiddenPostIdList.includes(postId)) {
        setIsInterest(false);
      }
    }
  }, [postId]);

  useEffect(() => {
    if (!profilePost) return;

    setSnsPost(profilePost);
  }, [profilePost]);

  useEffect(() => {
    if (isErrorByProfilePost) {
      navigate(`${PROFILE_LIST_PATH}/${user_id}`, { replace: true });
    }
  }, [isErrorByProfilePost]);

  const { windowWidth } = useWindowSize();

  // Ref 관련 변수
  const likeIconRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const likeCountRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const postCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 상태 관리 관련 변수
  const [replyMsg, setReplyMsg] = useState<PostCommentReplyMsgInfo | null>(
    null,
  );

  const funcPrevCloseButton = () => {
    if (isApp()) {
      stackRouterBack(navigate);
    } else {
      navigate(-1);
    }
  };

  const appContainerRefObject = useRef<HTMLDivElement>(null);

  const [initPageInfo, setInitPageInfo] = useRecoilState(initPageInfoAtom);

  useEffect(() => {
    if (isApp()) {
      setTimeout(() => {
        sendInitEvent();
      }, 50);
      requestAnimationFrame(() => {
        setTimeout(() => {
          setInitPageInfo((prev) => ({
            ...prev,
            isProfilePostPage: true,
          }));
        }, 100);
      });
    }

    return () => {
      resetSnsPost();
    };
  }, []);

  return (
    <>
      <PageHelmentInfoElement
        title={snsPost.postTitle || snsPost.postBodyText || APP_SERVICE_NAME}
        ogTitle={snsPost.postTitle || snsPost.postBodyText || APP_SERVICE_NAME}
        ogImage={getRandomImage(
          snsPost.postContents
            .filter((v) => v.postContentType === POST_IMAGE_TYPE)
            .map((v) => v.content),
          snsPost.profilePath,
        )}
        ogUrl={window.location.href}
        ogDescription={
          snsPost.postTitle || snsPost.postBodyText || APP_SERVICE_NAME
        }
      />
      {isApp() ? (
        <>
          <ProfilePostByMobileContainer
            style={{
              opacity: initPageInfo.isProfilePostPage ? 1 : 0,
              transition: `opacity 0.3s ease-in`,
            }}
          >
            {postId && (
              <ProfilePostDetailBody
                postId={postId}
                snsPost={snsPost}
                isIntereset={isIntereset}
                setIsInterest={setIsInterest}
                windowWidthSize={windowWidth}
                funcPrevCloseButton={funcPrevCloseButton}
                isErrorProfilePost={isErrorByProfilePost}
                ProfilePostWrapStyle={
                  windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM
                    ? { paddingTop: '10px' }
                    : {}
                }
              />
            )}
          </ProfilePostByMobileContainer>
          {/* <BottomNavBar /> */}
        </>
      ) : (
        <Suspense fallback={<></>}>
          <AppBaseTemplate
            hasSearchBodyModule={false}
            isAppInsetTopMargin={false}
            isAppContainerTopMargin={false || !isIntereset}
            isTransparentSearchButton={true}
            AppContainerStyle={{
              borderRadius:
                windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM
                  ? ImageBorderRadius
                  : ``,
            }}
            isScrollSave={false}
            fixedScrollPos={0}
            appContainerRefObject={appContainerRefObject}
            slideBarNode={
              <>
                {postId && windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM && (
                  <Suspense fallback={<></>}>
                    <PostReactionPopupSideWrap>
                      <PostReactionPopupHeader
                        PostReactionTabStyle={{
                          marginTop: '0px',
                          paddingTop: `${theme.systemSize.header.heightNumber + 17}px`,
                          flexShrink: '0',
                        }}
                      />
                      <PostReactionPopupSideBodyWrap id={COMMENT_CONTAINER_ID}>
                        <PostReactionPopupBody
                          postId={postId || ''}
                          likeCountRef={likeCountRef}
                          likeIconRef={likeIconRef}
                          postCommentTextareaRef={postCommentTextareaRef}
                          commentReplyCountRef={commentReplyCountRef}
                          setReplyMsg={setReplyMsg}
                        />
                      </PostReactionPopupSideBodyWrap>
                      <PostReactionPopupSideInputWrap>
                        {reactionTabId === POST_REACTION_COMMENT_ID && (
                          <PostReactionCommentSendElement
                            postId={postId}
                            postCommentTextareaRef={postCommentTextareaRef}
                            commentReplyCountRef={commentReplyCountRef}
                            username={snsPost.username}
                            replyMsg={replyMsg}
                            setReplyMsg={setReplyMsg}
                          />
                        )}
                      </PostReactionPopupSideInputWrap>
                    </PostReactionPopupSideWrap>
                  </Suspense>
                )}
              </>
            }
          >
            {postId && (
              <ProfilePostDetailBody
                postId={postId}
                snsPost={snsPost}
                isIntereset={isIntereset}
                setIsInterest={setIsInterest}
                windowWidthSize={windowWidth}
                funcPrevCloseButton={funcPrevCloseButton}
                isErrorProfilePost={isErrorByProfilePost}
                scrollElement={appContainerRefObject.current || undefined}
                ProfilePostWrapStyle={
                  windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM
                    ? { paddingTop: '10px' }
                    : {}
                }
              />
            )}
          </AppBaseTemplate>
        </Suspense>
      )}
      {postId && (
        <ProfilePostDetailPopupManager
          postId={postId}
          snsPost={snsPost}
          replyMsg={replyMsg}
          setReplyMsg={setReplyMsg}
          likeIconRef={likeIconRef}
          likeCountRef={likeCountRef}
          commentReplyCountRef={commentReplyCountRef}
          postCommentTextareaRef={postCommentTextareaRef}
          funcPrevCloseButton={funcPrevCloseButton}
          windowWidthSize={windowWidth}
          setIsInterest={setIsInterest}
          isError={isErrorByProfilePost}
          errorMsg={errorByProfilePost?.response?.data.message || ''}
        />
      )}
      {isApp() && (
        <>
          <ToastPopup />
        </>
      )}
    </>
  );
};

const ProfilePostByMobileContainer = styled.div``;

const ImageBorderRadius = '20px';

const PostReactionPopupSideWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PostReactionPopupSideBodyWrap = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const PostReactionPopupSideInputWrap = styled.div`
  flex-shrink: 0;
`;

export default ProfilePostPage;
