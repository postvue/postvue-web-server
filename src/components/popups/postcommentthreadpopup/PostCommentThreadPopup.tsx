import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  PostCommentReplyMsgInfo,
  PostRsp,
} from '../../../global/interface/post';

import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
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
const PostCommentThreadPopup: React.FC<PostCommentThreadProps> = ({
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

  const { windowWidth } = useWindowSize();

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
      {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          onClose={() => setIsActiveThreadPopup(false)}
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
          onClose={() => setIsActiveThreadPopup(false)}
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
    </>
  );
};

export default PostCommentThreadPopup;
