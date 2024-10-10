import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ProfileAccountBirthdateEditBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/birthdate/ProfileAccountBirthdateEditBody';
import { ACCOUNT_SETTING_BIRTHDATE_EDIT_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

const ProfileAccountBirthdateEditPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <PrevButtonHeaderHeader
        titleName={ACCOUNT_SETTING_BIRTHDATE_EDIT_TAB_NAME}
      />
      <ProfileAccountBirthdateEditBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountBirthdateEditPage;
