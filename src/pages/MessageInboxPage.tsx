import React from 'react';
import TabBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MessageInboxBody from '../components/messageinbox/body/MessageInboxBody';
import MessageInboxHeader from '../components/messageinbox/header/MessageInboxHeader';

const MessageInboxPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MessageInboxHeader />
      <MessageInboxBody />
      <TabBar />
    </AppBaseTemplate>
  );
};

export default MessageInboxPage;
