import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import MyProfileEditBody from 'components/profile/myprofileedit/MyProfileEditBody';
import MyProfileEditHeader from 'components/profile/myprofileedit/MyProfileEditHeader';
import React from 'react';

const ProfileAccountSettingEditPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <MyProfileEditHeader />
      <MyProfileEditBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingEditPage;
