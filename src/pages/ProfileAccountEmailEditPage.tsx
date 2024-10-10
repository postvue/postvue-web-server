import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ProfileAccountEmailEditBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/email/ProfileAccountEmailEditBody';
import { ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

const ProfileAccountEmailEditPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <PrevButtonHeaderHeader titleName={ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME} />
      <ProfileAccountEmailEditBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountEmailEditPage;
