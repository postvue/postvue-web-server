import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { POST_COMMENT_INPUT_PLACEHOLDER } from '../../../../const/SystemPhraseConst';
import {
  PostCommentReplyMsgInfo,
  PostCommentWithReplies,
  PostRsp,
} from '../../../../global/interface/post';
import { getGroupComments } from '../../../../global/util/CommentUtil';
import PostCommentInfiniteScroll from '../../../../hook/PostCommentInfiniteScroll';
import { postReactionCommentHashMapAtom } from '../../../../states/PostReactionAtom';
import CommentInputSenderElement from '../../../common/comment/CommentInputSenderElement';
import PostCommentReplyElement from './PostCommentReplyElement';

interface PostReactionCommentBodyProps {
  postId: string;
  snsPost: PostRsp;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  likeIconRef: React.MutableRefObject<{
    [key: string]: SVGSVGElement | null;
  }>;
  likeCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}

const PostReactionCommentBody: React.FC<PostReactionCommentBodyProps> = ({
  postId,
  snsPost,
  postCommentTextareaRef,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
  replyMsg,
  setReplyMsg,
}) => {
  const [snsPostCommentHashMap, setSnsPostCommentHashMap] = useRecoilState(
    postReactionCommentHashMapAtom,
  );

  const defaultSendPlaceHolder = `${snsPost.username} ${POST_COMMENT_INPUT_PLACEHOLDER}`;

  const [groupComments, setGroupComments] = useState<
    Map<string, PostCommentWithReplies>
  >(new Map());
  useEffect(() => {
    setGroupComments(getGroupComments(snsPostCommentHashMap));
  }, [snsPostCommentHashMap]);

  const topLevelComments = Array.from(groupComments.values())
    .filter((comment) => comment.isReplyMsg === false)
    .sort((a, b) => b.postCommentId.localeCompare(a.postCommentId));

  return (
    <>
      <PostContentListContainer>
        {topLevelComments.map((comment) => (
          <PostCommentReplyElement
            key={comment.postCommentId}
            postId={postId}
            commentIdIndex={comment.postCommentId}
            postComment={comment}
            snsPostCommentHashMap={snsPostCommentHashMap}
            setSnsPostCommentHashMap={setSnsPostCommentHashMap}
            likeIconRef={likeIconRef}
            likeCountRef={likeCountRef}
            commentReplyCountRef={commentReplyCountRef}
            postCommentTextareaRef={postCommentTextareaRef}
            setReplyMsg={setReplyMsg}
            neededGroupBar={comment.replies.length > 0}
            comment={comment}
            isReplyToReply={false}
          />
        ))}

        {postId && <PostCommentInfiniteScroll postId={postId} />}
      </PostContentListContainer>

      <CommentInputSenderElement
        postId={postId}
        snsPostCommentHashMap={snsPostCommentHashMap}
        setSnsPostCommentHashMap={setSnsPostCommentHashMap}
        postCommentTextareaRef={postCommentTextareaRef}
        commentReplyCountRef={commentReplyCountRef}
        defaultSendPlaceHolder={defaultSendPlaceHolder}
        replyMsg={replyMsg}
        setReplyMsg={setReplyMsg}
      />
    </>
  );
};

const PostContentListContainer = styled.div`
  overflow: scroll;
  height: calc(100% - 230px);
`;

export default PostReactionCommentBody;
