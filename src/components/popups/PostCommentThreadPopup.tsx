import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import theme from 'styles/theme';
import { POST_COMMENT_INPUT_PLACEHOLDER } from '../../const/SystemPhraseConst';
import {
  PostCommentReplyMsgInfo,
  PostCommentWithReplies,
  PostRsp,
} from '../../global/interface/post';
import { getGroupComments } from '../../global/util/CommentUtil';
import PostCommentReplyInfiniteScroll from '../../hook/PostCommentReplyInfiniteScroll';
import { postReactionCommentHashMapAtom } from '../../states/PostReactionAtom';
import {
  activeCommentByPostCommentThreadAtom,
  postCommentRepliesThreadHashMapAtom,
} from '../../states/PostThreadAtom';
import CommentInputSenderElement from '../common/comment/CommentInputSenderElement';
import PopupLayout from '../layouts/PopupLayout';
import PrevButtonHeaderHeader from '../layouts/PrevButtonHeaderHeader';
import PostCommentElement from './postreactionpopup/body/PostCommentElement';
import PostCommentReplyElement from './postreactionpopup/body/PostCommentReplyElement';

const popupWrapStyle: React.CSSProperties = {
  borderRadius: '0px',
};

interface PostCommentThreadProps {
  snsPost: PostRsp;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
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
const PostCommentThread: React.FC<PostCommentThreadProps> = ({
  snsPost,
  postCommentTextareaRef,
  replyMsg,
  setReplyMsg,
  likeIconByCommentRef,
  likeCountByCommentRef,
  commentCountByCommentRef,
}) => {
  // Ref 관련 변수
  const likeIconRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const likeCountRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const commmentInputSenderWrapRef = useRef<HTMLDivElement | null>(null);

  // 상태관리 변수
  const [
    activeCommentByPostCommentThread,
    setActiveCommentByPostCommentThread,
  ] = useRecoilState(activeCommentByPostCommentThreadAtom);

  const [snsPostCommentHashMap, setSnsPostCommentHashMap] = useRecoilState(
    postReactionCommentHashMapAtom,
  );

  const [isActiveThreadPopup, setIsActiveThreadPopup] = useState<boolean>(
    activeCommentByPostCommentThread.isActive,
  );
  const [postCommentRepliesHashMap, setPostCommentRepliesHashMap] =
    useRecoilState(postCommentRepliesThreadHashMapAtom);

  // 상수 값
  const replyComentByComment = snsPostCommentHashMap.get(
    activeCommentByPostCommentThread.commentId,
  );

  // useEffect(() => {
  //   const tempSnsPostCommentRepliesHashMap = new Map(postCommentRepliesHashMap);

  //   if (replyComentByComment) {
  //     tempSnsPostCommentRepliesHashMap.set(
  //       replyComentByComment.postCommentId,
  //       replyComentByComment,
  //     );
  //     setPostCommentRepliesHashMap(tempSnsPostCommentRepliesHashMap);
  //   }
  // }, [replyComentByComment]);

  const [groupComments, setGroupComments] = useState<
    Map<string, PostCommentWithReplies>
  >(new Map());
  useEffect(() => {
    setGroupComments(getGroupComments(postCommentRepliesHashMap));
  }, [postCommentRepliesHashMap]);

  const topLevelComments = Array.from(groupComments.values())
    .filter((comment) => comment.isReplyMsg === false)
    .sort((a, b) => b.postCommentId.localeCompare(a.postCommentId));

  useEffect(() => {
    if (!isActiveThreadPopup) {
      setActiveCommentByPostCommentThread({
        postId: '',
        commentId: '',
        username: '',
        userId: '',
        isActive: false,
      });

      setReplyMsg(null);
    }
  }, [isActiveThreadPopup]);

  return (
    <PopupLayout
      setIsPopup={setIsActiveThreadPopup}
      isTouchScrollBar={false}
      popupOverLayContainerStyle={popupWrapStyle}
      hasTransparentOverLay={true}
      hasFixedActive={false}
    >
      <PrevButtonHeaderHeader
        titleName="답글 보기"
        isActionFunc={true}
        actionFunc={() => setIsActiveThreadPopup(false)}
        preNodeByState={<PreHeaderButtonNode>이전</PreHeaderButtonNode>}
        HeaderLayoutStyle={{
          maxWidth: theme.systemSize.appDisplaySize.maxWidth,
        }}
      />

      <PostCommentWrap>
        {replyComentByComment && (
          <PostCommentElement
            postId={activeCommentByPostCommentThread.postId}
            commentIdIndex={replyComentByComment.postCommentId}
            postComment={replyComentByComment}
            snsPostCommentHashMap={snsPostCommentHashMap}
            setSnsPostCommentHashMap={setSnsPostCommentHashMap}
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
      <PostReplyContainer
        $commentSenderHeight={
          commmentInputSenderWrapRef.current?.offsetHeight || 0
        }
      >
        {topLevelComments.map((comment) => (
          <>
            <PostCommentReplyElement
              key={comment.postCommentId}
              postId={activeCommentByPostCommentThread.postId}
              commentIdIndex={comment.postCommentId}
              postComment={comment}
              snsPostCommentHashMap={postCommentRepliesHashMap}
              setSnsPostCommentHashMap={setPostCommentRepliesHashMap}
              likeIconRef={likeIconRef}
              likeCountRef={likeCountRef}
              commentReplyCountRef={commentReplyCountRef}
              postCommentTextareaRef={postCommentTextareaRef}
              setReplyMsg={setReplyMsg}
              neededGroupBar={comment.replies.length > 0}
              comment={comment}
              isReplyToReply={true}
            />
          </>
        ))}

        {activeCommentByPostCommentThread.postId !== '' &&
          activeCommentByPostCommentThread.commentId !== '' && (
            <PostCommentReplyInfiniteScroll
              postId={activeCommentByPostCommentThread.postId}
              commentId={activeCommentByPostCommentThread.commentId}
            />
          )}
      </PostReplyContainer>

      <CommentInputSenderElement
        commentSenderRef={commmentInputSenderWrapRef}
        postId={activeCommentByPostCommentThread.postId}
        snsPostCommentHashMap={postCommentRepliesHashMap}
        setSnsPostCommentHashMap={setPostCommentRepliesHashMap}
        postCommentTextareaRef={postCommentTextareaRef}
        commentReplyCountRef={commentReplyCountRef}
        replyMsg={replyMsg}
        setReplyMsg={setReplyMsg}
        defaultSendPlaceHolder={`${activeCommentByPostCommentThread.username} ${POST_COMMENT_INPUT_PLACEHOLDER}`}
        isReplyToReply={true}
        isThread={true}
        threadCommentId={activeCommentByPostCommentThread.commentId}
      />
    </PopupLayout>
  );
};

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

const PreHeaderButtonNode = styled.div`
  padding-left: 18px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.grey.Grey6};
  cursor: pointer;
`;

const PostCommentWrap = styled.div`
  margin-top: ${({ theme }) => theme.systemSize.header.height};
`;

const PostReplyContainer = styled.div<{ $commentSenderHeight: number }>`
  margin-bottom: ${(props) => props.$commentSenderHeight}px;
`;

export default PostCommentThread;
