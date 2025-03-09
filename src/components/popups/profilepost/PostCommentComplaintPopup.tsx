import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activePostCommentComplaintPopupAtom } from 'states/PostAtom';
import PostCommentComplaintPopupBody from './PostCommentComplaintPopupBody';

const PostCommentComplaintPopup: React.FC = () => {
  const [activePostCommentComplaintPopup, setActivePostCommentComplaintPopup] =
    useRecoilState(activePostCommentComplaintPopupAtom);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isOpen={activePostCommentComplaintPopup.isActive}
          onClose={() =>
            setActivePostCommentComplaintPopup({
              isActive: false,
              postId: '',
              userId: '',
              username: '',
              commentId: '',
            })
          }
          heightNum={
            450 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          <PostCommentComplaintPopupBody
            postId={activePostCommentComplaintPopup.postId}
            commentId={activePostCommentComplaintPopup.commentId}
            userId={activePostCommentComplaintPopup.userId}
            username={activePostCommentComplaintPopup.username}
            setIsExternalCloseFunc={setIsExternalCloseFunc}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {activePostCommentComplaintPopup.isActive && (
            <RoundSquareCenterPopupLayout
              onClose={() =>
                setActivePostCommentComplaintPopup({
                  isActive: false,
                  postId: '',
                  userId: '',
                  username: '',
                  commentId: '',
                })
              }
              popupOverLayContainerStyle={{ zIndex: '2000' }}
              popupWrapStyle={{ height: '500px', width: '400px' }}
            >
              <PostCommentComplaintPopupBody
                postId={activePostCommentComplaintPopup.postId}
                userId={activePostCommentComplaintPopup.userId}
                username={activePostCommentComplaintPopup.username}
                commentId={activePostCommentComplaintPopup.commentId}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostCommentComplaintPopup;
