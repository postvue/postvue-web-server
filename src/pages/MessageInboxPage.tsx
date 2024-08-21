import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MessageInboxBody from '../components/messageinbox/body/MessageInboxBody';
import MessageInboxHeader from '../components/messageinbox/header/MessageInboxHeader';
import FollowManageByMsgInboxPopup from '../components/messageinbox/popup/FollowManageByMsgInboxPopup';
import { isFolloManagePopupByMsgInboxAtom } from '../states/MsgInboxAtom';

const MessageInboxPage: React.FC = () => {
  const [isFolloManagePopupByMsgInbox, setIsFolloManagePopupByMsgInbox] =
    useRecoilState(isFolloManagePopupByMsgInboxAtom);

  useEffect(() => {
    return () => {
      setIsFolloManagePopupByMsgInbox(false);
    };
  }, []);

  return (
    <AppBaseTemplate>
      <MessageInboxHeader />
      <MessageInboxBody />
      <BottomNavBar />
      {isFolloManagePopupByMsgInbox && <FollowManageByMsgInboxPopup />}
    </AppBaseTemplate>
  );
};

export default MessageInboxPage;
