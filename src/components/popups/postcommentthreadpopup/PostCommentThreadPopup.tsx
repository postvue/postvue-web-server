import React, { useRef, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import {
  PostCommentReplyMsgInfo,
  PostRsp,
} from '../../../global/interface/post';

import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { COMMENT_THREAD_CONTAINER_ID } from 'const/IdNameConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { activeCommentByPostCommentThreadAtom } from '../../../states/PostThreadAtom';
import PostCommentThreadPopupBody from './PostCommentThreadPopupBody';
import PostCommentThreadPopupBottom from './PostCommentThreadPopupBottom';
import PostCommentThreadPopupHeader from './PostCommentThreadPopupHeader';

interface PostCommentThreadProps {
  snsPost: PostRsp;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  likeIconByCommentRef: React.MutableRefObject<{
    [key: string]: SVGSVGElement | null;
  }>;
  likeCountByCommentRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  commentCountByCommentRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}
const PostCommentThreadPopup: React.FC<PostCommentThreadProps> = ({
  snsPost,
  postCommentTextareaRef,
  replyMsg,
  setReplyMsg,
  likeIconByCommentRef,
  likeCountByCommentRef,
  commentCountByCommentRef,
}) => {
  // 상태관리 변수
  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
  );

  const resetActiveCommentByPostCommentThread = useResetRecoilState(
    activeCommentByPostCommentThreadAtom,
  );

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          onClose={() => {
            setReplyMsg(null);
            resetActiveCommentByPostCommentThread();
          }}
          popupWrapStyle={{ height: '90%' }}
        >
          <PostCommentThreadPopupHeader
            funcPrevButton={() => {
              setReplyMsg(null);
              resetActiveCommentByPostCommentThread();
            }}
          />
          <PostCommentThreadPopupBody
            snsPost={snsPost}
            setReplyMsg={setReplyMsg}
            postCommentTextareaRef={postCommentTextareaRef}
            likeIconByCommentRef={likeIconByCommentRef}
            likeCountByCommentRef={likeCountByCommentRef}
            commentCountByCommentRef={commentCountByCommentRef}
            commentReplyCountRef={commentReplyCountRef}
            PostCommentThreadPopupBodyStyle={{
              overflowY: 'scroll',
              height: '100%',
            }}
          />
          <PostCommentThreadPopupBottom
            replyMsg={replyMsg}
            setReplyMsg={setReplyMsg}
            postCommentTextareaRef={postCommentTextareaRef}
            commentCountByCommentRef={commentCountByCommentRef}
          />
        </RoundSquareCenterPopupLayout>
      ) : (
        <BottomSnapSheetLayout
          isOpen={activeCommentByPostCommentThread.isActive}
          onClose={() => resetActiveCommentByPostCommentThread()}
          prevOnClose={() => {
            setReplyMsg(null);
          }}
          isRoundPopup={false}
          heightNum={window.innerHeight}
          isExternalCloseFunc={isExternalCloseFunc}
          scrollContainerElementId={COMMENT_THREAD_CONTAINER_ID}
          bottomSheetHeader={
            <PostCommentThreadPopupHeader
              funcPrevButton={() => {
                setIsExternalCloseFunc(true);
              }}
            />
          }
          hasScrollBar={false}
          BottomSheetBottom={
            <PostCommentThreadPopupBottom
              replyMsg={replyMsg}
              setReplyMsg={setReplyMsg}
              postCommentTextareaRef={postCommentTextareaRef}
              commentCountByCommentRef={commentCountByCommentRef}
            />
          }
        >
          <PostCommentThreadPopupBody
            snsPost={snsPost}
            setReplyMsg={setReplyMsg}
            postCommentTextareaRef={postCommentTextareaRef}
            likeIconByCommentRef={likeIconByCommentRef}
            likeCountByCommentRef={likeCountByCommentRef}
            commentCountByCommentRef={commentCountByCommentRef}
            commentReplyCountRef={commentReplyCountRef}
          />
        </BottomSnapSheetLayout>
      )}
    </>
  );
};

export default PostCommentThreadPopup;
