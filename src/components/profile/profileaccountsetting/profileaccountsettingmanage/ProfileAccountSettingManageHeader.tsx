import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

const ProfileAccountSettingManageHeader: React.FC = () => {
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME}
    />
  );
};

export default ProfileAccountSettingManageHeader;
