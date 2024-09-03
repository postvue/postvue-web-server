import React from 'react';
import { SetterOrUpdater } from 'recoil';
import {
  PostComment,
  PostCommentReplyMsgInfo,
  PostCommentWithReplies,
} from '../../../../global/interface/post';
import PostCommentElement from './PostCommentElement';

interface PostCommentReplyElementProps {
  postId: string;
  commentIdIndex: string;
  postComment: PostComment;
  snsPostCommentHashMap: Map<string, PostComment>;
  setSnsPostCommentHashMap: SetterOrUpdater<Map<string, PostComment>>;
  likeIconRef: React.MutableRefObject<{
    [key: string]: SVGSVGElement | null;
  }>;
  likeCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  neededGroupBar: boolean;
  comment: PostCommentWithReplies;
  isReplyToReply: boolean;
}

// 댓글을 렌더링하는 컴포넌트
const PostCommentReplyElement: React.FC<PostCommentReplyElementProps> = ({
  postId,
  commentIdIndex,
  postComment,
  snsPostCommentHashMap,
  setSnsPostCommentHashMap,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
  postCommentTextareaRef,
  setReplyMsg,
  neededGroupBar,
  comment,
  isReplyToReply,
}) => {
  return (
    <>
      <PostCommentElement
        postId={postId}
        commentIdIndex={commentIdIndex}
        postComment={postComment}
        snsPostCommentHashMap={snsPostCommentHashMap}
        setSnsPostCommentHashMap={setSnsPostCommentHashMap}
        likeIconRef={likeIconRef}
        likeCountRef={likeCountRef}
        commentReplyCountRef={commentReplyCountRef}
        postCommentTextareaRef={postCommentTextareaRef}
        setReplyMsg={setReplyMsg}
        neededGroupBar={neededGroupBar}
        isReplyToReply={isReplyToReply}
        replyCommentNum={comment.replies.length}
      />
      {comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((reply, index) => (
          <PostCommentReplyElement
            key={reply.postCommentId}
            comment={reply}
            postId={postId}
            commentIdIndex={reply.postCommentId}
            postComment={reply}
            snsPostCommentHashMap={snsPostCommentHashMap}
            setSnsPostCommentHashMap={setSnsPostCommentHashMap}
            likeIconRef={likeIconRef}
            likeCountRef={likeCountRef}
            commentReplyCountRef={commentReplyCountRef}
            postCommentTextareaRef={postCommentTextareaRef}
            setReplyMsg={setReplyMsg}
            neededGroupBar={
              index < comment.replies.length - 1 ||
              (index === comment.replies.length - 1 && reply.replies.length > 0)
            }
            isReplyToReply={isReplyToReply}
          />
        ))}
    </>
  );
};

export default PostCommentReplyElement;
