import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActiveMsgBlockHiddenManagePopupAtom } from '../../../states/MsgInboxAtom';
import MsgBlockHiddenManagePopupBody from './MsgBlockHiddenManagePopupBody';

const MsgBlockHiddenManagePopup: React.FC = () => {
  const [
    isActiveMsgBlockHiddenManagePopup,
    setIsActiveMsgBlockHiddenManagePopup,
  ] = useRecoilState(isActiveMsgBlockHiddenManagePopupAtom);

  return (
    // <PopupLayout
    //   setIsPopup={setIsActiveMsgBlockHiddenManagePopup}
    //   popupWrapStyle={PopupWrapStyle}
    // >
    //   <MsgBlockHiddenManagePopupBody />
    // </PopupLayout>
    <BottomSheetLayout
      isOpen={isActiveMsgBlockHiddenManagePopup}
      onClose={() => setIsActiveMsgBlockHiddenManagePopup(false)}
      heightNum={150}
    >
      <MsgBlockHiddenManagePopupBody />
    </BottomSheetLayout>
  );
};

export default MsgBlockHiddenManagePopup;
