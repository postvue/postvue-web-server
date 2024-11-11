import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import MsgBlockHiddenManagePopup from 'components/messageinbox/popup/MsgBlockHiddenManagePopup';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MessageInboxBody from '../components/messageinbox/body/MessageInboxBody';
import MessageInboxHeader from '../components/messageinbox/header/MessageInboxHeader';
import { isActiveMsgBlockHiddenManagePopupAtom } from '../states/MsgInboxAtom';

const MessageInboxPage: React.FC = () => {
  const [
    isActiveMsgBlockHiddenManagePopup,
    setIsActiveMsgBlockHiddenManagePopup,
  ] = useRecoilState(isActiveMsgBlockHiddenManagePopupAtom);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    return () => {
      setIsActiveMsgBlockHiddenManagePopup(false);
    };
  }, []);

  return (
    <AppBaseTemplate>
      <MessageInboxHeader />
      <MessageInboxBody />
      <BottomNavBar />
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM &&
        isActiveMsgBlockHiddenManagePopup && <MsgBlockHiddenManagePopup />}
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </AppBaseTemplate>
  );
};

export default MessageInboxPage;
