import CommentInputSenderElement from 'components/common/comment/CommentInputSenderElement';
import { POST_COMMENT_INPUT_PLACEHOLDER } from 'const/SystemPhraseConst';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import React, { useRef } from 'react';

interface PostReactionCommentSendElementProps {
  postId: string;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  username: string;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
}

const PostReactionCommentSendElement: React.FC<
  PostReactionCommentSendElementProps
> = ({
  postId,
  postCommentTextareaRef,
  commentReplyCountRef,
  username,
  replyMsg,
  setReplyMsg,
}) => {
  const commentSenderRef = useRef<HTMLDivElement>(null);

  return (
    <CommentInputSenderElement
      postId={postId}
      //@REFER: snsPostCommentHashMap 잔재 제거 필요
      // snsPostCommentHashMap={snsPostCommentHashMap}
      // setSnsPostCommentHashMap={setSnsPostCommentHashMap}
      commentSenderRef={commentSenderRef}
      postCommentTextareaRef={postCommentTextareaRef}
      commentReplyCountRef={commentReplyCountRef}
      defaultSendPlaceHolder={`${username} ${POST_COMMENT_INPUT_PLACEHOLDER}`}
      replyMsg={replyMsg}
      setReplyMsg={setReplyMsg}
      containerBorderRadiusNum={20}
    />
  );
};

export default PostReactionCommentSendElement;
