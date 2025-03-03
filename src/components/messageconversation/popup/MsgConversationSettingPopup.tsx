import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import { ProfileInfoByDirectMsg } from 'global/interface/profile';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isSettingByMsgConversationAtom } from '../../../states/MessageAtom';
import MsgConversationSettingPopupBody from './MsgConversationSettingPopupBody';

interface MsgConversationSettingPopupProps {
  targetProfileInfo: ProfileInfoByDirectMsg;
}

const MsgConversationSettingPopup: React.FC<
  MsgConversationSettingPopupProps
> = ({ targetProfileInfo }) => {
  const [isSettingByMsgConversation, setIsSettingByMsgConversation] =
    useRecoilState(isSettingByMsgConversationAtom);

  return (
    // <PopupLayout
    //   setIsPopup={setIsSettingByMsgConversation}
    //   popupWrapStyle={PopupWrapStyle}
    // >
    //   <MsgConversationSettingPopupBody targetProfileInfo={targetProfileInfo} />
    // </PopupLayout>

    <BottomSheetLayout
      isOpen={isSettingByMsgConversation}
      onClose={() => setIsSettingByMsgConversation(false)}
      heightNum={
        220 +
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--safe-area-inset-bottom',
            ),
          ) || 0
      }
    >
      <MsgConversationSettingPopupBody targetProfileInfo={targetProfileInfo} />
    </BottomSheetLayout>
  );
};

export default MsgConversationSettingPopup;
