import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ProfileAccountGenderEditBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/gender/ProfileAccountGenderEditBody';
import { ACCOUNT_SETTING_GENDER_EDIT_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

const ProfileAccountGenderEditPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <PrevButtonHeaderHeader
        titleName={ACCOUNT_SETTING_GENDER_EDIT_TAB_NAME}
      />
      <ProfileAccountGenderEditBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountGenderEditPage;
