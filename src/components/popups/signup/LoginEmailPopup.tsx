import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
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
  return (
    <>
      {windowWidth > theme.systemSize.appDisplaySize.maxWidthNum ? (
        <RoundSquareCenterPopupLayout
          onClose={onClose}
          popupWrapStyle={{ height: '500px', width: '450px' }}
        >
          <LoginEmailPopupBody onOpen={onOpen} height={500} />
        </RoundSquareCenterPopupLayout>
      ) : (
        <BottomSheetLayout onClose={onClose} isOpen={isOpen} heightNum={630}>
          <LoginEmailPopupBody onOpen={onOpen} height={630} />
        </BottomSheetLayout>
      )}
    </>
  );
};

export default LoginEmailPopup;
