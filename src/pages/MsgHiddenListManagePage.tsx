import React from 'react';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MsgHiddenListBody from '../components/msghiddenlist/MsgHiddenListBody';
import MsgHiddenListHeader from '../components/msghiddenlist/MsgHiddenListHeader';

const MsgHiddenListManagePage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MsgHiddenListHeader />
      <MsgHiddenListBody />
    </AppBaseTemplate>
  );
};

export default MsgHiddenListManagePage;
