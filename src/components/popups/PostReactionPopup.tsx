import React, { useEffect, useRef, useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../const/ClassNameConst';
import {
  POST_REACTION_COMMENT_ID,
  POST_REACTION_COMMENT_NAME,
  POST_REACTION_LIKE_ID,
  POST_REACTION_LIKE_NAME,
  POST_REACTION_REPOST_ID,
  POST_REACTION_REPOST_NAME,
} from '../../const/TabConfigConst';
import { PostCommentReplyMsgInfo } from '../../global/interface/post';
import PostLikeListInfiniteScroll from '../../hook/PostLikeListInfiniteScroll';
import RepostListInfiniteScroll from '../../hook/RepostListInfiniteScroll';
import { postRspAtom } from '../../states/PostAtom';
import {
  cursorIdAtomByPostReactionComment,
  cursorIdAtomByPostReactionLike,
  cursorIdAtomByPostReactionRepost,
  isPostReactionAtom,
  postReactionCommentHashMapAtom,
  postReactionLikeHashMapAtom,
  postReactionRepostHashMapAtom,
  reactionPostIdAtom,
} from '../../states/PostReactionAtom';
import { activeCommentByPostCommentThreadAtom } from '../../states/PostThreadAtom';
import PopupLayout from '../layouts/PopupLayout';
import PostCommentThread from './PostCommentThreadPopup';
import PostProfileFollowBody from './postreactionpopup/body/PostProfileFollowBody';
import PostReactionCommentBody from './postreactionpopup/body/PostReactionCommentBody';

const popupContentWrapStyle: React.CSSProperties = {
  height: '85%',
};

interface PostReactionPopupProps {
  postId: string;
}

const PostReactionPopup: React.FC<PostReactionPopupProps> = ({ postId }) => {
  // Ref 관련 변수
  const likeIconRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const likeCountRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const postCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 상태 관리 관련 변수
  const [replyMsg, setReplyMsg] = useState<PostCommentReplyMsgInfo | null>(
    null,
  );

  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);
  const setReactionPostId = useSetRecoilState(reactionPostIdAtom);
  const snsPost = useRecoilValue(postRspAtom);

  const [repostHashMap, setRepostHashMap] = useRecoilState(
    postReactionRepostHashMapAtom,
  );
  const [postLikeHashMap, setPostLikeHashMap] = useRecoilState(
    postReactionLikeHashMapAtom,
  );

  const [reactionTabId, setReactionTabId] = useState<number>(
    POST_REACTION_COMMENT_ID,
  );

  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
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
  const resetSnsPostCommentHashMap = useResetRecoilState(
    postReactionCommentHashMapAtom,
  );
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
      resetSnsPostCommentHashMap();
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
      <PopupLayout
        popupWrapStyle={popupContentWrapStyle}
        setIsPopup={setIsPopupActive}
      >
        <ReactionTitle>
          반응 {snsPost.reactionCount ? snsPost.reactionCount : 0} 개
        </ReactionTitle>
        <PostReactionWrap>
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
      </PopupLayout>
      {activeCommentByPostCommentThread.isActive && (
        <PostCommentThread
          snsPost={snsPost}
          postCommentTextareaRef={postCommentTextareaRef}
          replyMsg={replyMsg}
          setReplyMsg={setReplyMsg}
          likeIconByCommentRef={likeIconRef}
          likeCountByCommentRef={likeCountRef}
          commentCountByCommentRef={commentReplyCountRef}
        />
      )}
    </>
  );
};

const ReactionTitle = styled.div`
  text-align: center;
  padding-top: 33px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const PostReactionWrap = styled.div`display: flex;
    justify-content: space-between;
    padding-top: 17px;
    border-bottom : 1px solid ${({ theme }) => theme.grey.Grey2};
}`;

const PostReactionTab = styled.div`
  width: 100%;
  text-align: center;

  padding-bottom: 5px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};

  &.active {
    border-bottom: 2px solid;
  }
`;

export default PostReactionPopup;
