import React, { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {
  POST_REACTION_COMMENT_ID,
  POST_REACTION_LIKE_ID,
  POST_REACTION_REPOST_ID,
} from '../../../../const/TabConfigConst';
import { PostCommentReplyMsgInfo } from '../../../../global/interface/post';
import PostLikeListInfiniteScroll from '../../../../hook/PostLikeListInfiniteScroll';
import RepostListInfiniteScroll from '../../../../hook/RepostListInfiniteScroll';
import {
  cursorIdAtomByPostReactionComment,
  cursorIdAtomByPostReactionLike,
  cursorIdAtomByPostReactionRepost,
  isPostReactionAtom,
  postReactionLikeHashMapAtom,
  postReactionRepostHashMapAtom,
  postReactionTabIdAtom,
  reactionPostIdAtom,
} from '../../../../states/PostReactionAtom';
import PostProfileFollowBody from '../body/PostProfileFollowBody';
import PostReactionCommentBody from '../body/PostReactionCommentBody';

interface PostReactionPopupBodyProps {
  postId: string;
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
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  PostReactionPopupBodyStyle?: React.CSSProperties;
}

const PostReactionPopupBody: React.FC<PostReactionPopupBodyProps> = ({
  postId,
  postCommentTextareaRef,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
  setReplyMsg,
  PostReactionPopupBodyStyle,
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

  const reactionTabId = useRecoilValue(postReactionTabIdAtom);

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
  const resetReactionTabId = useResetRecoilState(postReactionTabIdAtom);

  useEffect(() => {
    return () => {
      resetRepostHashMap();
      resetPostLikeHashMap();
      resetCommentCursorNum();
      resetLikeCursorNum();
      resetRepostCursorNum();
      resetReactionTabId();
    };
  }, []);

  useEffect(() => {
    if (!isPopupActive) {
      setReactionPostId('');
    }
  }, [isPopupActive]);
  return (
    <div style={PostReactionPopupBodyStyle}>
      {reactionTabId === POST_REACTION_COMMENT_ID ? (
        <>
          {postId !== '' && (
            <PostReactionCommentBody
              postId={postId}
              postCommentTextareaRef={postCommentTextareaRef}
              likeIconRef={likeIconRef}
              likeCountRef={likeCountRef}
              commentReplyCountRef={commentReplyCountRef}
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
    </div>
  );
};

export default PostReactionPopupBody;
