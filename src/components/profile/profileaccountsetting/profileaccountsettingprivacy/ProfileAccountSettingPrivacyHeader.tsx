import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

const ProfileAccountSettingPrivacyHeader: React.FC = () => {
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME}
    />
  );
};

export default ProfileAccountSettingPrivacyHeader;
