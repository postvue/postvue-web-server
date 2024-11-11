import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isSettingByMsgConversationAtom } from '../../../states/MessageAtom';
import PopupLayout from '../../layouts/PopupLayout';
import MsgConversationSettingPopupBody from './MsgConversationSettingPopupBody';

interface MsgConversationSettingPopupProps {
  targetProfileInfo: ProfileInfoByDirectMsg;
}

const MsgConversationSettingPopup: React.FC<
  MsgConversationSettingPopupProps
> = ({ targetProfileInfo }) => {
  const setIsSettingByMsgConversation = useSetRecoilState(
    isSettingByMsgConversationAtom,
  );

  return (
    <PopupLayout
      setIsPopup={setIsSettingByMsgConversation}
      popupWrapStyle={PopupWrapStyle}
    >
      <MsgConversationSettingPopupBody targetProfileInfo={targetProfileInfo} />
    </PopupLayout>
  );
};

const PopupWrapStyle: React.CSSProperties = {
  height: 'auto',
};

export default MsgConversationSettingPopup;
