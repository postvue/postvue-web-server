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
} from '../../../../const/TabConfigConst';
import { PostCommentReplyMsgInfo } from '../../../../global/interface/post';
import {
  isFocusPostReactionInputAtom,
  isPostReactionAtom,
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

  const reactionTabId = useRecoilValue(postReactionTabIdAtom);

  const resetReactionTabId = useResetRecoilState(postReactionTabIdAtom);

  useEffect(() => {
    return () => {
      resetReactionTabId();
    };
  }, []);

  useEffect(() => {
    if (!isPopupActive) {
      setReactionPostId('');
    }
  }, [isPopupActive]);

  const [isFocusPostReactionInput, setIsFocusPostReactionInput] =
    useRecoilState(isFocusPostReactionInputAtom);
  return (
    <div
      style={{ ...PostReactionPopupBodyStyle }}
      onClick={() => {
        // 입력창 비활성화
        if (isFocusPostReactionInput) {
          setIsFocusPostReactionInput(false);
        }
      }}
    >
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
      ) : reactionTabId === POST_REACTION_LIKE_ID ? (
        <>{postId && <PostProfileFollowBody postId={postId} />}</>
      ) : (
        // : reactionTabId === POST_REACTION_REPOST_ID ? (
        //   <PostProfileFollowBody
        //     postProfileInfoMap={repostHashMap}
        //     PostProfileFollowInfiniteScroll={
        //       <RepostListInfiniteScroll postId={postId} />
        //     }
        //   />
        // )
        <></>
      )}
    </div>
  );
};

export default PostReactionPopupBody;
