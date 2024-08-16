import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
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
import PostLikeListInfiniteScroll from '../../hook/PostLikeListInfiniteScroll';
import RepostListInfiniteScroll from '../../hook/RepostListInfiniteScroll';
import { postRspAtom } from '../../states/PostAtom';
import {
  cursorIdAtomByPostReactionComment,
  cursorIdAtomByPostReactionLike,
  cursorIdAtomByPostReactionRepost,
  isPostReactionPopupAtom,
  postReactionCommentHashMapAtom,
  postReactionLikeHashMapAtom,
  postReactionRepostHashMapAtom,
} from '../../states/PostReactionAtom';
import PopupLayout from '../layouts/PopupLayout';
import PostProfileFollowBody from './postreactionpopup/body/PostProfileFollowBody';
import PostReactionCommentBody from './postreactionpopup/body/PostReactionCommentBody';

const popupWrapStyle: React.CSSProperties = {
  height: '85%',
};

interface PostReactionPopupProps {
  postId: string;
}

const PostReactionPopup: React.FC<PostReactionPopupProps> = ({ postId }) => {
  const [isPostReactionPopup, setIsPostReactionPopup] = useRecoilState(
    isPostReactionPopupAtom,
  );
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

  return (
    <PopupLayout
      popupWrapStyle={popupWrapStyle}
      setIsPopup={setIsPostReactionPopup}
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
        <PostReactionCommentBody postId={postId} />
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
                <PostLikeListInfiniteScroll postId={postId} />
              }
            />
          )}
        </>
      ) : (
        <></>
      )}
    </PopupLayout>
  );
};

const ReactionTitle = styled.div`
  text-align: center;
  padding-top: 33px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};

  };
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
