import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ProfileAccountSettingPrivateProfileBody from 'components/profile/profileaccountsetting/profileaccountsettingprivateaccount/ProfileAccountSettingPrivateProfileBody';
import { ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

const ProfileAccountPrivateProfilePage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <PrevButtonHeaderHeader
        titleName={ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME}
      />
      <ProfileAccountSettingPrivateProfileBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountPrivateProfilePage;
