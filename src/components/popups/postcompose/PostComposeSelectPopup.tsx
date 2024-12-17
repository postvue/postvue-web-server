import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isActivPostComposeSelectPopupAtom } from 'states/PostComposeAtom';
import PostComposePopupBody from './PostComposePopupBody';

const PostComposeSelectPopup: React.FC = () => {
  const [isActivePostComposeSelectPopup, setIsActivePostComposeSelectPopup] =
    useRecoilState(isActivPostComposeSelectPopupAtom);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isOpen={isActivePostComposeSelectPopup}
          onClose={() => {
            setIsActivePostComposeSelectPopup(false);
          }}
          heightNum={250}
          isExternalCloseFunc={isExternalCloseFunc}
          setIsExternalCloseFunc={setIsExternalCloseFunc}
        >
          <PostComposePopupBody
            setIsExternalCloseFunc={setIsExternalCloseFunc}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {isActivePostComposeSelectPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActivePostComposeSelectPopup(false)}
              popupWrapStyle={{ height: '230px', width: '400px' }}
            >
              <PostComposePopupBody />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostComposeSelectPopup;
