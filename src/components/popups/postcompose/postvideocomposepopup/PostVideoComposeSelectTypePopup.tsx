import React, { useState } from 'react';

import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { useRecoilState } from 'recoil';
import { isActivPostComposeVideoSelectTypePopupAtom } from 'states/PostComposeAtom';
import PostVideoComposeSelectTypePopupBody from './PostVideoComposeSelectTypePopupBody';

const PostVideoComposeSelectTypePopup: React.FC = () => {
  const [
    isActivPostComposeVideoSelectTypePopup,
    setIsActivPostComposeVideoSelectTypePopup,
  ] = useRecoilState(isActivPostComposeVideoSelectTypePopupAtom);

  const { windowWidth } = useWindowSize();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsActivPostComposeVideoSelectTypePopup}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={popupWrapStyle}
        // >
        //   <PostComposeVideoSelectTypePopupBody
        //     targetAudTabId={targetAudTabId}
        //     setTargetAudTabId={setTargetAudTabId}
        //     targetAudTabList={targetAudTabList}
        //   />
        // </PopupLayout>
        <BottomSheetLayout
          isOpen={isActivPostComposeVideoSelectTypePopup}
          onClose={() => setIsActivPostComposeVideoSelectTypePopup(false)}
          heightNum={
            220 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          <PostVideoComposeSelectTypePopupBody
            onClose={() => setIsExternalCloseFunc(true)}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {isActivPostComposeVideoSelectTypePopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActivPostComposeVideoSelectTypePopup(false)}
              popupWrapStyle={{ height: '90%' }}
              hasFixedActive={false}
            >
              <PostVideoComposeSelectTypePopupBody
                onClose={() => setIsActivPostComposeVideoSelectTypePopup(false)}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostVideoComposeSelectTypePopup;
