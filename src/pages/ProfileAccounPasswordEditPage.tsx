import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ProfileAccountPasswordEditBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/password/ProfileAccountPasswordEditBody';
import { ACCOUNT_SETTING_PASSWORD_EDIT_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

const ProfileAccountPasswordEditPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <PrevButtonHeaderHeader
        titleName={ACCOUNT_SETTING_PASSWORD_EDIT_TAB_NAME}
      />
      <ProfileAccountPasswordEditBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountPasswordEditPage;
