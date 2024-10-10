import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileAccountSettingManageBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/ProfileAccountSettingManageBody';
import ProfileAccountSettingManageHeader from 'components/profile/profileaccountsetting/profileaccountsettingmanage/ProfileAccountSettingManageHeader';

import React from 'react';

const ProfileAccountSettingManagePage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <ProfileAccountSettingManageHeader />
      <ProfileAccountSettingManageBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingManagePage;
