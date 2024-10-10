import ProfileAccountSettingBlockedUserListHeader from 'components/profile/profileaccountsetting/profileaccountsettingblockeduserlist/ProfileAccountSettingBlockedUserListHeader';
import ProfileAccountSettingBlockListBody from 'components/profile/profileaccountsetting/profileaccountsettingblockeduserlist/ProfileAccountSettingBlockListBody';
import React from 'react';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const ProfileBlockedUserListManagePage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <ProfileAccountSettingBlockedUserListHeader />
      <ProfileAccountSettingBlockListBody />
    </AppBaseTemplate>
  );
};

export default ProfileBlockedUserListManagePage;
