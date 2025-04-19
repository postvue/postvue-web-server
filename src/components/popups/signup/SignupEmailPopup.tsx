import BottomSheetNotScrollLayout from 'components/layouts/BottomSheetNotScrollLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import theme from 'styles/theme';
import SignupEmailPopupBody from './signupemailpopup/SignupEmailPopupBody';

interface SignupEmailPopupProps {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const SignupEmailPopup: React.FC<SignupEmailPopupProps> = ({
  onOpen,
  onClose,
  isOpen,
}) => {
  const { windowWidth } = useWindowSize();
  return (
    <>
      {windowWidth > theme.systemSize.appDisplaySize.maxWidthNum ? (
        <RoundSquareCenterPopupLayout
          onClose={onClose}
          popupWrapStyle={{ height: '700px', width: '450px' }}
        >
          <SignupEmailPopupBody onOpen={onOpen} />
        </RoundSquareCenterPopupLayout>
      ) : (
        <BottomSheetNotScrollLayout
          onClose={onClose}
          isOpen={isOpen}
          heightNum={
            // 660 +
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
          <SignupEmailPopupBody onOpen={onOpen} />
        </BottomSheetNotScrollLayout>
      )}
    </>
  );
};

export default SignupEmailPopup;
