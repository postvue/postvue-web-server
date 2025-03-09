import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACCOUNT_SETTING_HELP_CENTER_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

interface ProfileAccountSettingHelpCenterHeaderProps {
  isPrevButton?: boolean;
}

const ProfileAccountSettingHelpCenterHeader: React.FC<
  ProfileAccountSettingHelpCenterHeaderProps
> = ({ isPrevButton = true }) => {
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_HELP_CENTER_TAB_NAME}
      isActionFunc={!isPrevButton}
      preNodeByState={!isPrevButton && <></>}
    />
  );
};

export default ProfileAccountSettingHelpCenterHeader;
