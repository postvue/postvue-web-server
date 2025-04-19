import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import ProfilePostDetailBody from 'components/post/profilepost/ProfilePostDetailBody';
import ProfilePostDetailPopupManager from 'components/post/profilepost/ProfilePostDetailPopupManager';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import { getHiddenPostIdList } from 'global/util/HiddenPostIdListUtil';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import { isValidString } from 'global/util/ValidUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateProfilePost } from 'hook/queryhook/QueryStateProfilePost';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  isExternalClosePostDetailPopupAtom,
  isFixScrollToPostDetailPopupAtom,
  isPostDetailInfoPopupAtom,
  postContentZoomPopupInfoAtom,
  postDetailInfoPopupAtom,
  postExternelEventInfoAtom,
  postRspAtom,
} from 'states/PostAtom';
import { isPostReactionAtom } from 'states/PostReactionAtom';
import theme from 'styles/theme';
import ProfilePostDetailPopupLayout from './ProfilePostDetailPopupLayout';

const ProfilePostDetailPopup: React.FC = () => {
  const goBackOrNavigate = useGoBackOrNavigate(location.pathname);
  const [postDetailInfoPopup, setPostDetailInfoPopup] = useRecoilState(
    postDetailInfoPopupAtom,
  );

  const [isPostDetailInfoPopup, setIsPostDetailInfoPopup] = useRecoilState(
    isPostDetailInfoPopupAtom,
  );

  const resetIsFixScrollToPostDetailPopup = useResetRecoilState(
    isFixScrollToPostDetailPopupAtom,
  );

  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  const [isExternalClosePostDetailPopup, setIsExternalClosePostDetailPopup] =
    useRecoilState(isExternalClosePostDetailPopupAtom);
  const resetIsExternalClosePostDetailPopup = useResetRecoilState(
    isExternalClosePostDetailPopupAtom,
  );
  const resetSnsPost = useResetRecoilState(postRspAtom);

  const hiddenPostIdList = getHiddenPostIdList();
  const [isIntereset, setIsInterest] = useState<boolean>(true);

  const {
    data: profilePost,
    isError: isErrorByProfilePost,
    error: errorByProfilePost,
  } = QueryStateProfilePost(postDetailInfoPopup.postId || '', true);

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
  const postContentZoomPopupInfo = useRecoilValue(postContentZoomPopupInfoAtom);
  const isPopupActive = useRecoilValue(isPostReactionAtom);

  useEffect(() => {
    ScrollRef.current?.scrollTo({ top: 0 });
    if (postDetailInfoPopup.postId) {
      if (hiddenPostIdList.includes(postDetailInfoPopup.postId)) {
        setIsInterest(false);
      }
    }
  }, [postDetailInfoPopup.postId]);

  useEffect(() => {
    if (!profilePost) return;
    if (deepEqual(snsPost, profilePost)) return;

    setSnsPost(profilePost);
  }, [profilePost]);

  useEffect(() => {
    return () => {
      setPostDetailInfoPopup({
        postId: '',
        userId: '',
      });
      setIsPostDetailInfoPopup(false);
      resetSnsPost();
      resetIsFixScrollToPostDetailPopup();
      resetIsExternalClosePostDetailPopup();
    };
  }, []);

  function deepEqual<T>(obj1: T, obj2: T): boolean {
    if (obj1 === obj2) return true; // 같은 참조이거나 원시 값이 같을 경우

    if (
      typeof obj1 !== 'object' ||
      typeof obj2 !== 'object' ||
      obj1 === null ||
      obj2 === null
    ) {
      return false; // 하나라도 객체가 아니거나 null이면 다름
    }

    const keys1 = Object.keys(obj1) as Array<keyof T>;
    const keys2 = Object.keys(obj2) as Array<keyof T>;

    if (keys1.length !== keys2.length) return false; // 키 개수가 다르면 다름

    return keys1.every((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === 'object' && typeof val2 === 'object') {
        return deepEqual(val1, val2); // 객체 내부를 재귀적으로 비교
      }

      return val1 === val2; // 원시 값 비교
    });
  }

  const { windowWidth } = useWindowSize();

  const navigate = useNavigate();

  const funcPrevCloseButton = () => {
    if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
      navigate(-1);
    } else {
      setIsExternalClosePostDetailPopup(true);
    }
  };

  const windowWidthSize = theme.systemSize.appDisplaySize.maxWidthNum;

  const postExternelEventInfo = useRecoilValue(postExternelEventInfoAtom);
  const resetPostExternelEventInfo = useResetRecoilState(
    postExternelEventInfoAtom,
  );

  const ScrollRef = useRef<HTMLDivElement>(null);

  return (
    // 구버전
    // <PopupLayout
    //   setIsPopup={setIsPostDetailInfoPopup}
    //   popupWrapStyle={{ borderRadius: '0px' }}
    //   popupOverLayContainerStyle={{ zIndex: '100' }}
    //   hasTransparentOverLay={true}
    // >
    //   <ProfilePostDetailBody
    //     postId={postDetailInfoPopup.postId}
    //     snsPost={snsPost}
    //     setSnsPost={setSnsPost}
    //     isIntereset={isIntereset}
    //     setIsInterest={setIsInterest}
    //     replyMsg={replyMsg}
    //     setReplyMsg={setReplyMsg}
    //     windowWidthSize={MEDIA_MOBILE_MAX_WIDTH_NUM}
    //     likeIconRef={likeIconRef}
    //     likeCountRef={likeCountRef}
    //     commentReplyCountRef={commentReplyCountRef}
    //     postCommentTextareaRef={postCommentTextareaRef}
    //   />
    // </PopupLayout>

    <>
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          onClose={() => {
            setPostDetailInfoPopup({
              postId: '',
              userId: '',
            });
            setIsPostDetailInfoPopup(false);
            goBackOrNavigate();
          }}
          popupContentWrapStyle={{
            overflowY: 'scroll',
            padding: 0,
            marginTop: '10px',
          }}
        >
          <ProfilePostDetailBody
            postId={postDetailInfoPopup.postId}
            snsPost={snsPost}
            isIntereset={isIntereset}
            setIsInterest={setIsInterest}
            windowWidthSize={windowWidthSize}
            funcPrevCloseButton={() => {
              navigate(-1);
            }}
            fixNum={2}
            ProfilePostWrapStyle={{ boxShadow: 'none', margin: 0 }}
            linkPopupInfo={{
              isLinkPopup: true,
              isReplaced: true,
            }}
            isErrorProfilePost={isErrorByProfilePost}
          />
        </RoundSquareCenterPopupLayout>
      ) : (
        <ProfilePostDetailPopupLayout
          ScrollRef={ScrollRef}
          isOpen={
            isPostDetailInfoPopup && isValidString(postDetailInfoPopup.postId)
          }
          onClose={() => {
            setPostDetailInfoPopup({
              postId: '',
              userId: '',
            });
            navigate(-1);
            // navigate(location.pathname, { replace: true });
            setIsPostDetailInfoPopup(false);
          }}
          isActiveExternalPopup={
            postContentZoomPopupInfo.isActive || isPopupActive
          }
          isExternalCloseFunc={isExternalClosePostDetailPopup}
          isProcessingSideScroll={postExternelEventInfo.isActiveSideScroll}
          prevOnClose={() => {
            resetPostExternelEventInfo();
          }}
        >
          <ProfilePostDetailBody
            postId={postDetailInfoPopup.postId}
            snsPost={snsPost}
            isIntereset={isIntereset}
            setIsInterest={setIsInterest}
            windowWidthSize={windowWidthSize}
            funcPrevCloseButton={funcPrevCloseButton}
            linkPopupInfo={{
              isLinkPopup: false,
              isReplaced: true,
            }}
            isErrorProfilePost={isErrorByProfilePost}
            searchType={postDetailInfoPopup.searchType}
          />
        </ProfilePostDetailPopupLayout>
      )}
      <ProfilePostDetailPopupManager
        postId={postDetailInfoPopup.postId}
        snsPost={snsPost}
        replyMsg={replyMsg}
        setReplyMsg={setReplyMsg}
        likeIconRef={likeIconRef}
        likeCountRef={likeCountRef}
        commentReplyCountRef={commentReplyCountRef}
        postCommentTextareaRef={postCommentTextareaRef}
        funcPrevCloseButton={funcPrevCloseButton}
        windowWidthSize={windowWidthSize}
        setIsInterest={setIsInterest}
        isError={isErrorByProfilePost}
        errorMsg={errorByProfilePost?.response?.data.message || ''}
      />
    </>
  );
};

export default ProfilePostDetailPopup;
