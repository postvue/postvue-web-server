import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activePostCommentComplaintPopupAtom } from 'states/PostAtom';
import PostCommentComplaintPopupBody from './PostCommentComplaintPopupBody';

interface PostCommentComplaintPopupProps {
  isFixed?: boolean;
}

const PostCommentComplaintPopup: React.FC<PostCommentComplaintPopupProps> = ({
  isFixed = true,
}) => {
  const [activePostCommentComplaintPopup, setActivePostCommentComplaintPopup] =
    useRecoilState(activePostCommentComplaintPopupAtom);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isFixed={isFixed}
          isOpen={activePostCommentComplaintPopup.isActive}
          onClose={() =>
            setActivePostCommentComplaintPopup({
              isActive: false,
              postId: '',
              commentId: '',
            })
          }
          heightNum={500}
          isExternalCloseFunc={isExternalCloseFunc}
          setIsExternalCloseFunc={setIsExternalCloseFunc}
        >
          <PostCommentComplaintPopupBody
            postId={activePostCommentComplaintPopup.postId}
            commentId={activePostCommentComplaintPopup.commentId}
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
                  commentId: '',
                })
              }
              popupWrapStyle={{ height: '500px', width: '400px' }}
            >
              <PostCommentComplaintPopupBody
                postId={activePostCommentComplaintPopup.postId}
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
