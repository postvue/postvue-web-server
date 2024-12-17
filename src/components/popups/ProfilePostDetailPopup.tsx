import ProfilePostDetailBody from 'components/post/profilepost/ProfilePostDetailBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import { getHiddenPostIdList } from 'global/util/HiddenPostIdListUtil';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStateProfilePost } from 'hook/queryhook/QueryStateProfilePost';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  isPostDetailInfoPopupAtom,
  postContentZoomPopupInfoAtom,
  postDetailInfoPopupAtom,
  postRspAtom,
} from 'states/PostAtom';
import { isPostReactionAtom } from 'states/PostReactionAtom';
import { systemPostRspHashMapAtom } from 'states/SystemConfigAtom';
import ProfilePostDetailPopupLayout from './ProfilePostDetailPopupLayout';

const ProfilePostDetailPopup: React.FC = () => {
  const snsSystemPostHashMap = useRecoilValue(systemPostRspHashMapAtom);
  const [postDetailInfoPopup, setPostDetailInfoPopup] = useRecoilState(
    postDetailInfoPopupAtom,
  );

  const [isPostDetailInfoPopup, setIsPostDetailInfoPopup] = useRecoilState(
    isPostDetailInfoPopupAtom,
  );

  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  const hiddenPostIdList = getHiddenPostIdList();
  const [isIntereset, setIsInterest] = useState<boolean>(true);

  const [isQueryProfilePost, setIsQueryProfilePost] = useState<boolean>(false);

  const { data: profilePost, isError: isErrorByProfilePost } =
    QueryStateProfilePost(postDetailInfoPopup.postId || '', isQueryProfilePost);

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
      const selectedPost = snsSystemPostHashMap.get(postDetailInfoPopup.postId);

      if (selectedPost) {
        setSnsPost(selectedPost);
      } else {
        setIsQueryProfilePost(true);
      }

      if (hiddenPostIdList.includes(postDetailInfoPopup.postId)) {
        setIsInterest(false);
      }
    }
  }, [postDetailInfoPopup.postId]);

  useEffect(() => {
    if (!profilePost) return;
    setSnsPost(profilePost);
  }, [profilePost]);

  useEffect(() => {
    return () => {
      setPostDetailInfoPopup({
        postId: '',
        userId: '',
      });
      setIsPostDetailInfoPopup(false);
    };
  }, []);

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
        windowWidthSize={MEDIA_MOBILE_MAX_WIDTH_NUM}
        likeIconRef={likeIconRef}
        likeCountRef={likeCountRef}
        commentReplyCountRef={commentReplyCountRef}
        postCommentTextareaRef={postCommentTextareaRef}
        isFixedPopup={false}
        isClosed={
          isPostDetailInfoPopup && isValidString(postDetailInfoPopup.postId)
        }
        setIsExternalCloseFunc={setIsExternalCloseFunc}
      />
    </ProfilePostDetailPopupLayout>
  );
};

export default ProfilePostDetailPopup;
