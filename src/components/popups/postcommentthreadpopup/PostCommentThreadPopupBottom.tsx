import React, { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { POST_COMMENT_INPUT_PLACEHOLDER } from '../../../const/SystemPhraseConst';
import { PostCommentReplyMsgInfo } from '../../../global/interface/post';

import { COMMENT_THREAD_CONTAINER_ID } from 'const/IdNameConst';
import { activeCommentByPostCommentThreadAtom } from '../../../states/PostThreadAtom';
import CommentInputSenderElement from '../../common/comment/CommentInputSenderElement';

interface PostCommentThreadPopupBottomProps {
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  commentCountByCommentRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}

const PostCommentThreadPopupBottom: React.FC<
  PostCommentThreadPopupBottomProps
> = ({
  postCommentTextareaRef,
  replyMsg,
  setReplyMsg,
  commentCountByCommentRef,
}) => {
  const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const commmentInputSenderWrapRef = useRef<HTMLDivElement | null>(null);

  // 상태관리 변수
  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
  );

  return (
    <CommentInputSenderElement
      commentSenderRef={commmentInputSenderWrapRef}
      postId={activeCommentByPostCommentThread.postId}
      postCommentTextareaRef={postCommentTextareaRef}
      commentReplyCountRef={commentReplyCountRef}
      replyMsg={replyMsg}
      setReplyMsg={setReplyMsg}
      defaultSendPlaceHolder={`${activeCommentByPostCommentThread.username} ${POST_COMMENT_INPUT_PLACEHOLDER}`}
      isReplyToReply={true}
      isThread={true}
      threadCommentId={activeCommentByPostCommentThread.commentId}
      commentCountByCommentCurrent={
        commentCountByCommentRef.current[
          activeCommentByPostCommentThread.commentId
        ]
      }
      commentContainerTypeId={COMMENT_THREAD_CONTAINER_ID}
    />
  );
};

export default PostCommentThreadPopupBottom;
