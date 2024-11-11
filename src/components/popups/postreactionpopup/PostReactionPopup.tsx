import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  PostCommentReplyMsgInfo,
  PostRsp,
} from '../../../global/interface/post';
import { isPostReactionAtom } from '../../../states/PostReactionAtom';
import PopupLayout from '../../layouts/PopupLayout';
import PostReactionPopupBody from './body/PostReactionPopupBody';

const popupContentWrapStyle: React.CSSProperties = {
  height: '85%',
};

interface PostReactionPopupProps {
  postId: string;
  snsPost: PostRsp;
}

const PostReactionPopup: React.FC<PostReactionPopupProps> = ({
  postId,
  snsPost,
}) => {
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

  return (
    <>
      <PopupLayout
        popupWrapStyle={popupContentWrapStyle}
        setIsPopup={setIsPopupActive}
      >
        <PostReactionPopupBody
          postId={postId}
          snsPost={snsPost}
          likeCountRef={likeCountRef}
          likeIconRef={likeIconRef}
          postCommentTextareaRef={postCommentTextareaRef}
          commentReplyCountRef={commentReplyCountRef}
          replyMsg={replyMsg}
          setReplyMsg={setReplyMsg}
        />
      </PopupLayout>
    </>
  );
};

export default PostReactionPopup;
