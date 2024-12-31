import ProfilePostDetailBody from 'components/post/profilepost/ProfilePostDetailBody';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import { getHiddenPostIdList } from 'global/util/HiddenPostIdListUtil';
import { useGoBackOrNavigate } from 'global/util/historyStateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStateProfilePost } from 'hook/queryhook/QueryStateProfilePost';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  isPostDetailInfoPopupAtom,
  postContentZoomPopupInfoAtom,
  postDetailInfoPopupAtom,
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

  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  const resetSnsPost = useResetRecoilState(postRspAtom);

  const hiddenPostIdList = getHiddenPostIdList();
  const [isIntereset, setIsInterest] = useState<boolean>(true);

  const { data: profilePost } = QueryStateProfilePost(
    postDetailInfoPopup.postId || '',
    true,
  );

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

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  useEffect(() => {
    if (postDetailInfoPopup.postId) {
      if (hiddenPostIdList.includes(postDetailInfoPopup.postId)) {
        setIsInterest(false);
      }
    }
  }, [postDetailInfoPopup.postId]);

  useEffect(() => {
    if (!profilePost) return;
    console.log(profilePost);
    if (deepEqual(snsPost, profilePost)) return;

    console.log('바뀌는 구나', profilePost?.isLiked);
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

  return (
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
    <ProfilePostDetailPopupLayout
      isOpen={
        isPostDetailInfoPopup && isValidString(postDetailInfoPopup.postId)
      }
      onClose={() => {
        setPostDetailInfoPopup({
          postId: '',
          userId: '',
        });
        setIsPostDetailInfoPopup(false);
        goBackOrNavigate();
      }}
      isActiveExternalPopup={postContentZoomPopupInfo.isActive || isPopupActive}
      isExternalCloseFunc={isExternalCloseFunc}
      setIsExternalCloseFunc={setIsExternalCloseFunc}
    >
      <ProfilePostDetailBody
        postId={postDetailInfoPopup.postId}
        snsPost={snsPost}
        setSnsPost={setSnsPost}
        isIntereset={isIntereset}
        setIsInterest={setIsInterest}
        replyMsg={replyMsg}
        setReplyMsg={setReplyMsg}
        windowWidthSize={theme.systemSize.appDisplaySize.maxWidthNum}
        likeIconRef={likeIconRef}
        likeCountRef={likeCountRef}
        commentReplyCountRef={commentReplyCountRef}
        postCommentTextareaRef={postCommentTextareaRef}
        isFixedPopup={false}
        isClosed={
          isPostDetailInfoPopup && isValidString(postDetailInfoPopup.postId)
        }
        prevCloseButtonByMobile={() => {
          setIsExternalCloseFunc(true);
        }}
      />
    </ProfilePostDetailPopupLayout>
  );
};

export default ProfilePostDetailPopup;
