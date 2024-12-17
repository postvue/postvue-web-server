import MsgBlockHiddenManagePopup from 'components/messageinbox/popup/MsgBlockHiddenManagePopup';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect } from 'react';
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

  const { windowWidth } = useWindowSize();

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
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
        <MsgBlockHiddenManagePopup />
      )}
    </AppBaseTemplate>
  );
};

export default MessageInboxPage;
