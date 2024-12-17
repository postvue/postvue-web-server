import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { POST_REACTION_COMMENT_ID } from 'const/TabConfigConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PostCommentReplyMsgInfo } from '../../../global/interface/post';
import {
  isPostReactionAtom,
  postReactionTabIdAtom,
} from '../../../states/PostReactionAtom';
import PostReactionCommentSendElement from './body/PostReactionCommentSendElement';
import PostReactionPopupBody from './body/PostReactionPopupBody';
import PostReactionPopupHeader from './body/PostReactionPopupHeader';

interface PostReactionPopupProps {
  postId: string;
  username: string;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  isFixed?: boolean;
}

const PostReactionPopup: React.FC<PostReactionPopupProps> = ({
  postId,
  username,
  replyMsg,
  setReplyMsg,
  isFixed = true,
}) => {
  // Ref 관련 변수
  const likeIconRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const likeCountRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const postCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);

  const { windowWidth, windowHeight } = useWindowSize();

  const reactionTabId = useRecoilValue(postReactionTabIdAtom);

  return (
    <>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   popupWrapStyle={popupContentWrapStyle}
        //   setIsPopup={setIsPopupActive}
        // >
        //   <PostReactionPopupBody
        //     postId={postId}
        //     snsPost={snsPost}
        //     likeCountRef={likeCountRef}
        //     likeIconRef={likeIconRef}
        //     postCommentTextareaRef={postCommentTextareaRef}
        //     commentReplyCountRef={commentReplyCountRef}
        //     replyMsg={replyMsg}
        //     setReplyMsg={setReplyMsg}
        //   />
        // </PopupLayout>
        <BottomSnapSheetLayout
          isFixed={isFixed}
          isOpen={isPopupActive}
          onClose={() => setIsPopupActive(false)}
          heightNum={Math.floor(windowHeight * (10 / 11))}
          bottomSheetHeader={<PostReactionPopupHeader />}
          BottomSheetBottom={
            reactionTabId === POST_REACTION_COMMENT_ID && (
              <PostReactionCommentSendElement
                postId={postId}
                postCommentTextareaRef={postCommentTextareaRef}
                commentReplyCountRef={commentReplyCountRef}
                username={username}
                replyMsg={replyMsg}
                setReplyMsg={setReplyMsg}
              />
            )
          }
        >
          <PostReactionPopupBody
            postId={postId}
            likeCountRef={likeCountRef}
            likeIconRef={likeIconRef}
            postCommentTextareaRef={postCommentTextareaRef}
            commentReplyCountRef={commentReplyCountRef}
            setReplyMsg={setReplyMsg}
          />
        </BottomSnapSheetLayout>
      ) : (
        <>
          {isPopupActive && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsPopupActive(false)}
              popupWrapStyle={{ height: '90%' }}
            >
              <PostReactionPopupHeader
                PostReactionTabStyle={{ flexShrink: 0 }}
              />
              <PostReactionPopupBody
                postId={postId}
                likeCountRef={likeCountRef}
                likeIconRef={likeIconRef}
                postCommentTextareaRef={postCommentTextareaRef}
                commentReplyCountRef={commentReplyCountRef}
                setReplyMsg={setReplyMsg}
                PostReactionPopupBodyStyle={{ flexGrow: 1, overflow: 'auto' }}
              />
              {reactionTabId === POST_REACTION_COMMENT_ID && (
                <PostReactionCommentSendElement
                  postId={postId}
                  postCommentTextareaRef={postCommentTextareaRef}
                  commentReplyCountRef={commentReplyCountRef}
                  username={username}
                  replyMsg={replyMsg}
                  setReplyMsg={setReplyMsg}
                />
              )}
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostReactionPopup;
