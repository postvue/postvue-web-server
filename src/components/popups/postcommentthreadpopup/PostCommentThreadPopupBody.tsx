import { QueryStatePostCommentListInfinite } from 'hook/queryhook/QueryStatePostCommentListInfinite';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import {
  PostComment,
  PostCommentReplyMsgInfo,
  PostCommentWithReplies,
  PostRsp,
} from '../../../global/interface/post';
import { getGroupComments } from '../../../global/util/CommentUtil';

import { COMMENT_THREAD_CONTAINER_ID } from 'const/IdNameConst';
import PostCommentReplyListInfiniteScroll from 'hook/PostCommentReplyListInfiniteScroll';
import { QueryStatePostCommentReplyListInfinite } from 'hook/queryhook/QueryStatePostCommentReplyListInfinite';
import { activeCommentByPostCommentThreadAtom } from '../../../states/PostThreadAtom';
import PostCommentElement from '../postreactionpopup/body/PostCommentElement';
import PostCommentReplyElement from '../postreactionpopup/body/PostCommentReplyElement';

interface PostCommentThreadPopupBodyProps {
  snsPost: PostRsp;
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
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  PostCommentThreadPopupBodyStyle?: React.CSSProperties;
}

const PostCommentThreadPopupBody: React.FC<PostCommentThreadPopupBodyProps> = ({
  snsPost,
  postCommentTextareaRef,
  setReplyMsg,
  likeIconByCommentRef,
  likeCountByCommentRef,
  commentCountByCommentRef,
  commentReplyCountRef,
  PostCommentThreadPopupBodyStyle,
}) => {
  // Ref 관련 변수
  const likeIconRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const likeCountRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 상태관리 변수
  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
  );

  const { data: postCommentList } = QueryStatePostCommentListInfinite(
    snsPost.postId,
  );

  const { data: postCommentReplyList, isFetched: isFetchedByPostCommentReply } =
    QueryStatePostCommentReplyListInfinite(
      snsPost.postId,
      activeCommentByPostCommentThread.commentId,
    );

  // 상수 값
  const [replyComentByComment, setReplyCommentByComment] =
    useState<PostComment | null>(null);

  useEffect(() => {
    if (!postCommentList) return;
    const replyComment = postCommentList.pages
      .flatMap((v) => v.snsPostCommentRspList)
      .find(
        (v) => v.postCommentId === activeCommentByPostCommentThread.commentId,
      );
    if (!replyComment) return;
    setReplyCommentByComment(replyComment);
  }, [postCommentList]);

  const [groupComments, setGroupComments] = useState<
    Map<string, PostCommentWithReplies>
  >(new Map());
  useEffect(() => {
    if (!postCommentReplyList) return;
    const postCommentReplyHashMap = new Map<string, PostComment>();
    postCommentReplyList.pages
      .flatMap((v) => v.snsPostCommentRspList)
      .forEach((postComment) => {
        postCommentReplyHashMap.set(postComment.postCommentId, postComment);
      });
    setGroupComments(getGroupComments(postCommentReplyHashMap));
  }, [postCommentReplyList]);

  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 700);
  }, []);

  const topLevelComments = Array.from(groupComments.values()).filter(
    (comment) => comment.isReplyMsg === false,
  );
  // .sort((a, b) => b.postCommentId.localeCompare(a.postCommentId));

  return (
    <PostCommentContainer
      style={PostCommentThreadPopupBodyStyle}
      id={COMMENT_THREAD_CONTAINER_ID}
    >
      <PostCommentWrap>
        {replyComentByComment && (
          <PostCommentElement
            postId={activeCommentByPostCommentThread.postId}
            commentIdIndex={replyComentByComment.postCommentId}
            postComment={replyComentByComment}
            postCommentTextareaRef={postCommentTextareaRef}
            setReplyMsg={setReplyMsg}
            likeIconRef={likeIconByCommentRef}
            likeCountRef={likeCountByCommentRef}
            commentReplyCountRef={commentCountByCommentRef}
            isReplyToReply={false}
            neededGroupBar={false}
            replyCommentNum={replyComentByComment.commentCount}
          />
        )}
      </PostCommentWrap>

      <ReplyTitleWrap>
        <ReplyTitle>답글</ReplyTitle>
        <ReplyTitleBar />
      </ReplyTitleWrap>
      <PostReplyContainer>
        {init &&
          isFetchedByPostCommentReply &&
          topLevelComments.map((comment) => (
            <PostCommentReplyElement
              key={comment.postCommentId}
              postId={activeCommentByPostCommentThread.postId}
              commentIdIndex={comment.postCommentId}
              postComment={comment}
              likeIconRef={likeIconRef}
              likeCountRef={likeCountRef}
              commentReplyCountRef={commentReplyCountRef}
              postCommentTextareaRef={postCommentTextareaRef}
              setReplyMsg={setReplyMsg}
              neededGroupBar={comment.replies.length > 0}
              comment={comment}
              isReplyToReply={true}
            />
          ))}

        {activeCommentByPostCommentThread.postId !== '' &&
          activeCommentByPostCommentThread.commentId !== '' && (
            <PostCommentReplyListInfiniteScroll
              postId={activeCommentByPostCommentThread.postId}
              commentId={activeCommentByPostCommentThread.commentId}
            />
          )}
      </PostReplyContainer>
    </PostCommentContainer>
  );
};

const PostCommentContainer = styled.div``;

const ReplyTitleWrap = styled.div``;

const ReplyTitleBar = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey2};
  height: 1px;
  width: 100%;
`;
const ReplyTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  color: ${({ theme }) => theme.grey.Grey8};
  padding: 7px 0px 7px 30px;
`;

const PostCommentWrap = styled.div``;

const PostReplyContainer = styled.div``;

export default PostCommentThreadPopupBody;
