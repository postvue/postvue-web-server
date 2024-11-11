import PostCommentListInfiniteScroll from 'hook/PostCommentListInfiniteScroll';
import { QueryStatePostCommentListInfinite } from 'hook/queryhook/QueryStatePostCommentListInfinite';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { POST_COMMENT_INPUT_PLACEHOLDER } from '../../../../const/SystemPhraseConst';
import {
  PostComment,
  PostCommentReplyMsgInfo,
  PostCommentWithReplies,
  PostRsp,
} from '../../../../global/interface/post';
import { getGroupComments } from '../../../../global/util/CommentUtil';
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
  // const [snsPostCommentHashMap, setSnsPostCommentHashMap] = useRecoilState(
  //   postReactionCommentHashMapAtom,
  // );

  const {
    data: postCommentList,
    isSuccess,
    isFetched,
  } = QueryStatePostCommentListInfinite(postId);

  const [groupComments, setGroupComments] = useState<
    Map<string, PostCommentWithReplies>
  >(new Map());
  useEffect(() => {
    if (!postCommentList) return;

    const postCommentList_ = postCommentList.pages
      .flatMap((v) => v.snsPostCommentRspList)
      .map((value) => value);

    const postCommentHashMap = new Map<string, PostComment>();

    postCommentList_.forEach((postComment) => {
      postCommentHashMap.set(postComment.postCommentId, postComment);
    });
    setGroupComments(getGroupComments(postCommentHashMap));
  }, [postCommentList, isSuccess, isFetched]);

  const topLevelComments = Array.from(groupComments.values())
    .filter((comment) => comment.isReplyMsg === false)
    .sort((a, b) => b.postCommentId.localeCompare(a.postCommentId));

  const commentSenderRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PostContentListContainer
        $commentInputHeight={commentSenderRef.current?.offsetHeight || 0}
      >
        {topLevelComments.length > 0 &&
          topLevelComments.map((comment) => (
            <PostCommentReplyElement
              key={comment.postCommentId}
              postId={postId}
              commentIdIndex={comment.postCommentId}
              postComment={comment}
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
        {topLevelComments.length <= 0 && (
          <NotPostComment>아직 댓글이 없습니다.</NotPostComment>
        )}

        {postId && <PostCommentListInfiniteScroll postId={postId} />}
      </PostContentListContainer>

      <CommentInputSenderElement
        postId={postId}
        //@REFER: snsPostCommentHashMap 잔재 제거 필요
        // snsPostCommentHashMap={snsPostCommentHashMap}
        // setSnsPostCommentHashMap={setSnsPostCommentHashMap}
        commentSenderRef={commentSenderRef}
        postCommentTextareaRef={postCommentTextareaRef}
        commentReplyCountRef={commentReplyCountRef}
        defaultSendPlaceHolder={`${snsPost.username} ${POST_COMMENT_INPUT_PLACEHOLDER}`}
        replyMsg={replyMsg}
        setReplyMsg={setReplyMsg}
        containerBorderRadiusNum={20}
      />
    </>
  );
};

const PostContentListContainer = styled.div<{ $commentInputHeight: number }>`
  overflow: scroll;
  height: calc(100% - ${(props) => props.$commentInputHeight}px);
  position: relative;
`;

const NotPostComment = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

export default PostReactionCommentBody;
