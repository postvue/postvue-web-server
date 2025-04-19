import BottomSheetNotScrollLayout from 'components/layouts/BottomSheetNotScrollLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import theme from 'styles/theme';
import LoginEmailPopupBody from './loginemailpopup/LoginEmailPopupBody';

interface LoginEmailPopupProps {
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
}

const LoginEmailPopup: React.FC<LoginEmailPopupProps> = ({
  onClose,
  onOpen,
  isOpen,
}) => {
  const { windowWidth } = useWindowSize();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);
  return (
    <>
      {windowWidth > theme.systemSize.appDisplaySize.maxWidthNum ? (
        <RoundSquareCenterPopupLayout
          onClose={onClose}
          popupWrapStyle={{ height: '500px', width: '450px' }}
        >
          <LoginEmailPopupBody
            onOpen={() => {
              onClose();
              onOpen();
            }}
            height={500}
          />
        </RoundSquareCenterPopupLayout>
      ) : (
        <BottomSheetNotScrollLayout
          onClose={onClose}
          isOpen={isOpen}
          isExternalCloseFunc={isExternalCloseFunc}
          heightNum={
            // 600 +
            //   parseFloat(
            //     getComputedStyle(document.documentElement).getPropertyValue(
            //       '--safe-area-inset-bottom',
            //     ),
            //   ) || 0
            window.innerHeight >
            theme.systemSize.appDisplaySize.minDeviceHeightNum
              ? window.innerHeight * (5 / 6)
              : window.innerHeight -
                theme.systemSize.appDisplaySize.popupMinusNumByMinDeviceNum
          }
        >
          <LoginEmailPopupBody
            onOpen={() => {
              setIsExternalCloseFunc(true);
              onOpen();
            }}
            height={
              (window.innerHeight >
              theme.systemSize.appDisplaySize.minDeviceHeightNum
                ? window.innerHeight * (5 / 6)
                : window.innerHeight -
                  theme.systemSize.appDisplaySize.popupMinusNumByMinDeviceNum) -
                parseFloat(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    '--safe-area-inset-bottom',
                  ),
                ) || 0
            }
          />
        </BottomSheetNotScrollLayout>
      )}
    </>
  );
};

export default LoginEmailPopup;
