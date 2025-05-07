import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
// import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { Suspense, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isActivPostComposeSelectPopupAtom } from 'states/PostComposeAtom';
import PostComposePopupBody from './PostComposeSelectPopupBody';

const RoundSquareCenterPopupLayout = React.lazy(
  () => import('components/layouts/RoundSquareCenterPopupLayout'),
);

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
          <PostComposePopupBody onClose={() => setIsExternalCloseFunc(true)} />
        </BottomSheetLayout>
      ) : (
        <>
          {isActivePostComposeSelectPopup && (
            <Suspense>
              <RoundSquareCenterPopupLayout
                onClose={() => setIsActivePostComposeSelectPopup(false)}
                popupWrapStyle={{ height: '300px', width: '400px' }}
              >
                <PostComposePopupBody
                  onClose={() => setIsActivePostComposeSelectPopup(false)}
                />
              </RoundSquareCenterPopupLayout>
            </Suspense>
          )}
        </>
      )}
    </>
  );
};

export default PostComposeSelectPopup;
