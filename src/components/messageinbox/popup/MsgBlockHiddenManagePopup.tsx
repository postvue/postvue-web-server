import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveMsgBlockHiddenManagePopupAtom } from '../../../states/MsgInboxAtom';
import PopupLayout from '../../layouts/PopupLayout';
import MsgBlockHiddenManagePopupBody from './MsgBlockHiddenManagePopupBody';

const MsgBlockHiddenManagePopup: React.FC = () => {
  const setIsActiveMsgBlockHiddenManagePopup = useSetRecoilState(
    isActiveMsgBlockHiddenManagePopupAtom,
  );

  return (
    <PopupLayout
      setIsPopup={setIsActiveMsgBlockHiddenManagePopup}
      popupWrapStyle={PopupWrapStyle}
    >
      <MsgBlockHiddenManagePopupBody />
    </PopupLayout>
  );
};

const PopupWrapStyle: React.CSSProperties = {
  height: 'auto',
};

export default MsgBlockHiddenManagePopup;
