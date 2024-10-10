import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileAccountSettingPrivacyBody from 'components/profile/profileaccountsetting/profileaccountsettingprivacy/ProfileAccountSettingPrivacyBody';
import ProfileAccountSettingPrivacyHeader from 'components/profile/profileaccountsetting/profileaccountsettingprivacy/ProfileAccountSettingPrivacyHeader';
import React from 'react';

const ProfileAccountSettingPrivacyPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <ProfileAccountSettingPrivacyHeader />
      <ProfileAccountSettingPrivacyBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingPrivacyPage;
