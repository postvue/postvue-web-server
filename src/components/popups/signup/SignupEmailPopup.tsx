import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
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
        <BottomSheetLayout onClose={onClose} isOpen={isOpen} heightNum={630}>
          <SignupEmailPopupBody onOpen={onOpen} />
        </BottomSheetLayout>
      )}
    </>
  );
};

export default SignupEmailPopup;
