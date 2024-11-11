import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  PostCommentReplyMsgInfo,
  PostRsp,
} from '../../../global/interface/post';

import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { activeCommentByPostCommentThreadAtom } from '../../../states/PostThreadAtom';
import PopupLayout from '../../layouts/PopupLayout';
import PostCommentThreadPopupBody from './PostCommentThreadPopupBody';

const popupWrapStyle: React.CSSProperties = {
  borderRadius: '0px',
};

interface PostCommentThreadProps {
  snsPost: PostRsp;
  replyMsg: PostCommentReplyMsgInfo | null;
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
  // 상태관리 변수
  const [
    activeCommentByPostCommentThread,
    setActiveCommentByPostCommentThread,
  ] = useRecoilState(activeCommentByPostCommentThreadAtom);

  const [isActiveThreadPopup, setIsActiveThreadPopup] = useState<boolean>(
    activeCommentByPostCommentThread.isActive,
  );

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
    <>
      {windowSize.width > MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsActiveThreadPopup}
          popupWrapStyle={{ height: '90%' }}
        >
          <PostCommentThreadPopupBody
            snsPost={snsPost}
            replyMsg={replyMsg}
            setReplyMsg={setReplyMsg}
            isActiveThreadPopup={isActiveThreadPopup}
            setIsActiveThreadPopup={setIsActiveThreadPopup}
            postCommentTextareaRef={postCommentTextareaRef}
            likeIconByCommentRef={likeIconByCommentRef}
            likeCountByCommentRef={likeCountByCommentRef}
            commentCountByCommentRef={commentCountByCommentRef}
          />
        </RoundSquareCenterPopupLayout>
      ) : (
        <PopupLayout
          setIsPopup={setIsActiveThreadPopup}
          isTouchScrollBar={false}
          popupOverLayContainerStyle={popupWrapStyle}
          hasTransparentOverLay={true}
          hasFixedActive={false}
          popupWrapStyle={{ borderRadius: '0px' }}
        >
          <PostCommentThreadPopupBody
            snsPost={snsPost}
            replyMsg={replyMsg}
            setReplyMsg={setReplyMsg}
            isActiveThreadPopup={isActiveThreadPopup}
            setIsActiveThreadPopup={setIsActiveThreadPopup}
            postCommentTextareaRef={postCommentTextareaRef}
            likeIconByCommentRef={likeIconByCommentRef}
            likeCountByCommentRef={likeCountByCommentRef}
            commentCountByCommentRef={commentCountByCommentRef}
          />
        </PopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

export default PostCommentThread;
