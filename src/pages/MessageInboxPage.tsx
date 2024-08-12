import React from 'react';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MessageInboxBody from '../components/messageinbox/body/MessageInboxBody';
import MessageInboxHeader from '../components/messageinbox/header/MessageInboxHeader';

const MessageInboxPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MessageInboxHeader />
      <MessageInboxBody />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default MessageInboxPage;
