import React from 'react';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MsgBlockListBody from '../components/msgblocklist/MsgBlockListBody';
import MsgBlockListHeader from '../components/msgblocklist/MsgBlockListHeader';

const MsgBlockListManagePage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MsgBlockListHeader />
      <MsgBlockListBody />
    </AppBaseTemplate>
  );
};

export default MsgBlockListManagePage;
