import React, { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import theme from 'styles/theme';
import { ACTIVE_CLASS_NAME } from '../../../../const/ClassNameConst';
import {
  POST_REACTION_COMMENT_ID,
  POST_REACTION_COMMENT_NAME,
  POST_REACTION_LIKE_ID,
  POST_REACTION_LIKE_NAME,
  POST_REACTION_REPOST_ID,
  POST_REACTION_REPOST_NAME,
} from '../../../../const/TabConfigConst';
import {
  PostCommentReplyMsgInfo,
  PostRsp,
} from '../../../../global/interface/post';
import PostLikeListInfiniteScroll from '../../../../hook/PostLikeListInfiniteScroll';
import RepostListInfiniteScroll from '../../../../hook/RepostListInfiniteScroll';
import {
  cursorIdAtomByPostReactionComment,
  cursorIdAtomByPostReactionLike,
  cursorIdAtomByPostReactionRepost,
  isPostReactionAtom,
  postReactionLikeHashMapAtom,
  postReactionRepostHashMapAtom,
  reactionPostIdAtom,
} from '../../../../states/PostReactionAtom';
import PostProfileFollowBody from '../body/PostProfileFollowBody';
import PostReactionCommentBody from '../body/PostReactionCommentBody';

interface PostReactionPopupBodyProps {
  postId: string;
  snsPost: PostRsp;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  likeIconRef: React.MutableRefObject<{
    [key: string]: SVGSVGElement | null;
  }>;
  likeCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  PostReactionTabStyle?: React.CSSProperties;
}

const PostReactionPopupBody: React.FC<PostReactionPopupBodyProps> = ({
  postId,
  snsPost,
  postCommentTextareaRef,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
  replyMsg,
  setReplyMsg,
  PostReactionTabStyle,
}) => {
  // 상태 관리 관련 변수

  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);
  const setReactionPostId = useSetRecoilState(reactionPostIdAtom);

  const [repostHashMap, setRepostHashMap] = useRecoilState(
    postReactionRepostHashMapAtom,
  );
  const [postLikeHashMap, setPostLikeHashMap] = useRecoilState(
    postReactionLikeHashMapAtom,
  );

  const [reactionTabId, setReactionTabId] = useState<number>(
    POST_REACTION_COMMENT_ID,
  );

  const reactionTabList = [
    {
      tabId: POST_REACTION_COMMENT_ID,
      tabName: POST_REACTION_COMMENT_NAME,
    },
    {
      tabId: POST_REACTION_REPOST_ID,
      tabName: POST_REACTION_REPOST_NAME,
    },
    {
      tabId: POST_REACTION_LIKE_ID,
      tabName: POST_REACTION_LIKE_NAME,
    },
  ];

  // RESET
  // const resetSnsPostCommentHashMap = useResetRecoilState(
  //   postReactionCommentHashMapAtom,
  // );
  const resetRepostHashMap = useResetRecoilState(postReactionRepostHashMapAtom);
  const resetPostLikeHashMap = useResetRecoilState(postReactionLikeHashMapAtom);
  const resetCommentCursorNum = useResetRecoilState(
    cursorIdAtomByPostReactionComment,
  );
  const resetLikeCursorNum = useResetRecoilState(
    cursorIdAtomByPostReactionLike,
  );
  const resetRepostCursorNum = useResetRecoilState(
    cursorIdAtomByPostReactionRepost,
  );

  useEffect(() => {
    return () => {
      // resetSnsPostCommentHashMap();
      resetRepostHashMap();
      resetPostLikeHashMap();
      resetCommentCursorNum();
      resetLikeCursorNum();
      resetRepostCursorNum();
    };
  }, []);

  useEffect(() => {
    if (!isPopupActive) {
      setReactionPostId('');
    }
  }, [isPopupActive]);
  return (
    <>
      <PostReactionWrap style={PostReactionTabStyle}>
        {reactionTabList.map((v, i) => (
          <PostReactionTab
            key={i}
            className={reactionTabId === v.tabId ? ACTIVE_CLASS_NAME : ''}
            onClick={() => {
              setReactionTabId(v.tabId);
            }}
          >
            {v.tabName}
          </PostReactionTab>
        ))}
      </PostReactionWrap>

      {reactionTabId === POST_REACTION_COMMENT_ID ? (
        <>
          {postId !== '' && (
            <PostReactionCommentBody
              postId={postId}
              snsPost={snsPost}
              postCommentTextareaRef={postCommentTextareaRef}
              likeIconRef={likeIconRef}
              likeCountRef={likeCountRef}
              commentReplyCountRef={commentReplyCountRef}
              replyMsg={replyMsg}
              setReplyMsg={setReplyMsg}
            />
          )}
        </>
      ) : reactionTabId === POST_REACTION_REPOST_ID ? (
        <PostProfileFollowBody
          postProfileInfoMap={repostHashMap}
          PostProfileFollowInfiniteScroll={
            <RepostListInfiniteScroll postId={postId} />
          }
        />
      ) : reactionTabId === POST_REACTION_LIKE_ID ? (
        <>
          {postId && (
            <PostProfileFollowBody
              postProfileInfoMap={postLikeHashMap}
              PostProfileFollowInfiniteScroll={
                <>
                  {postId !== '' && (
                    <PostLikeListInfiniteScroll postId={postId} />
                  )}
                </>
              }
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const PostReactionWrap = styled.div`display: flex;
    justify-content: space-between;
    margin-top: ${theme.systemSize.header.heightNumber}px;
    border-bottom : 1px solid ${({ theme }) => theme.grey.Grey2};
    z-index:1000;
}`;

const PostReactionTab = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;

  padding-bottom: 5px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};

  &.active {
    border-bottom: 2px solid;
  }
`;

export default PostReactionPopupBody;
