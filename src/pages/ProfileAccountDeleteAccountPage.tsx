import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ProfileAccountDeleteAccountBody from 'components/profile/profileaccountdelete/ProfileAccountDeleteAccountBody';
import React from 'react';

const ProfileAccountDeleteAccountPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <PrevButtonHeaderHeader titleName={''} />
      <ProfileAccountDeleteAccountBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountDeleteAccountPage;
