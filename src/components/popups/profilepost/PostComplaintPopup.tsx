import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { activePostComplaintPopupAtom } from 'states/PostAtom';
import PostComplaintPopupBody from './PostComplaintPopupBody';

interface PostComplaintPopupProps {
  postId: string;
}

const PostComplaintPopup: React.FC<PostComplaintPopupProps> = ({ postId }) => {
  const [activePostComplaintPopup, setActivePostComplaintPopup] =
    useRecoilState(activePostComplaintPopupAtom);
  const resetActivePostComplaintPopup = useResetRecoilState(
    activePostComplaintPopupAtom,
  );

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsActivePostComplaintPopup}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={popupWrapStyle}
        // >
        //   <PostComplaintPopupBody />
        //   </PopupLayout>
        <BottomSheetLayout
          isOpen={activePostComplaintPopup.isActive}
          onClose={() => resetActivePostComplaintPopup()}
          heightNum={
            470 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          <PostComplaintPopupBody
            postId={postId}
            setIsExternalCloseFunc={setIsExternalCloseFunc}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {activePostComplaintPopup.isActive && (
            <RoundSquareCenterPopupLayout
              onClose={() => resetActivePostComplaintPopup()}
              popupWrapStyle={{ height: '500px', width: '400px' }}
            >
              <PostComplaintPopupBody postId={postId} />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostComplaintPopup;
