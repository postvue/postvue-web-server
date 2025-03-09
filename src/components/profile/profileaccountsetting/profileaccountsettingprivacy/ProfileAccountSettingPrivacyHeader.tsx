import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

interface ProfileAccountSettingPrivacyHeaderProps {
  isPrevButton?: boolean;
}

const ProfileAccountSettingPrivacyHeader: React.FC<
  ProfileAccountSettingPrivacyHeaderProps
> = ({ isPrevButton = true }) => {
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME}
      isActionFunc={!isPrevButton}
      preNodeByState={!isPrevButton && <></>}
    />
  );
};

export default ProfileAccountSettingPrivacyHeader;
