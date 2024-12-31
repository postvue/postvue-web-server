import PostCommentListInfiniteScroll from 'hook/PostCommentListInfiniteScroll';
import { QueryStatePostCommentListInfinite } from 'hook/queryhook/QueryStatePostCommentListInfinite';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  PostComment,
  PostCommentReplyMsgInfo,
  PostCommentWithReplies,
} from '../../../../global/interface/post';
import { getGroupComments } from '../../../../global/util/commentUtil';
import PostCommentReplyElement from './PostCommentReplyElement';

interface PostReactionCommentBodyProps {
  postId: string;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
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
  postCommentTextareaRef,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
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

  return (
    <>
      <PostContentListContainer>
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
    </>
  );
};

const PostContentListContainer = styled.div`
  position: relative;
`;

const NotPostComment = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  font: ${({ theme }) => theme.fontSizes.Body3};
  white-space: nowrap;
`;

export default PostReactionCommentBody;
