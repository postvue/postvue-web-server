import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isActivePostComplaintPopupAtom } from 'states/PostAtom';
import PostComplaintPopupBody from './PostComplaintPopupBody';

interface PostComplaintPopupProps {
  isFixed?: boolean;
}

const PostComplaintPopup: React.FC<PostComplaintPopupProps> = ({
  isFixed = true,
}) => {
  const [isActivePostComplaintPopup, setIsActivePostComplaintPopup] =
    useRecoilState(isActivePostComplaintPopupAtom);

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
          isFixed={isFixed}
          isOpen={isActivePostComplaintPopup}
          onClose={() => setIsActivePostComplaintPopup(false)}
          heightNum={500}
          isExternalCloseFunc={isExternalCloseFunc}
          setIsExternalCloseFunc={setIsExternalCloseFunc}
        >
          <PostComplaintPopupBody
            setIsExternalCloseFunc={setIsExternalCloseFunc}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {isActivePostComplaintPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActivePostComplaintPopup(false)}
              popupWrapStyle={{ height: '500px', width: '400px' }}
            >
              <PostComplaintPopupBody />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostComplaintPopup;
