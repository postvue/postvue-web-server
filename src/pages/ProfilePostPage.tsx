import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import styled from 'styled-components';
import 'swiper/css';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import { PROFILE_LIST_PATH } from '../const/PathConst';
import { POST_IMAGE_TYPE } from '../const/PostContentTypeConst';
import { getHiddenPostIdList } from '../global/util/HiddenPostIdListUtil';
import { postRspAtom } from '../states/PostAtom';
import { postReactionTabIdAtom } from '../states/PostReactionAtom';
import theme from '../styles/theme';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import 'swiper/css/pagination';

import PostReactionPopupBody from 'components/popups/postreactionpopup/body/PostReactionPopupBody';

import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import PostReactionCommentSendElement from 'components/popups/postreactionpopup/body/PostReactionCommentSendElement';
import PostReactionPopupHeader from 'components/popups/postreactionpopup/body/PostReactionPopupHeader';
import ProfilePostDetailBody from 'components/post/profilepost/ProfilePostDetailBody';
import ProfilePostDetailPopupManager from 'components/post/profilepost/ProfilePostDetailPopupManager';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { COMMENT_CONTAINER_ID } from 'const/IdNameConst';
import { POST_REACTION_COMMENT_ID } from 'const/TabConfigConst';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import { getRandomImage } from 'global/util/ShareUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateProfilePost } from 'hook/queryhook/QueryStateProfilePost';
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
    return () => {
      resetSnsPost();
    };
  }, []);

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
    navigate(-1);
  };

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
      <AppBaseTemplate
        hasSearchBodyModule={false}
        isAppContainerTopMargin={false || !isIntereset}
        isTransparentSearchButton={true}
        AppContainerStyle={{
          borderRadius:
            windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM ? ImageBorderRadius : ``,
        }}
        isScrollSave={false}
        fixedScrollPos={0}
        slideBarNode={
          <>
            {postId && (
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
            ProfilePostWrapStyle={
              windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM
                ? { paddingTop: '10px' }
                : {}
            }
          />
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
      </AppBaseTemplate>
    </>
  );
};

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
