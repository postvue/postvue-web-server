import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';

interface ProfileAccountSettingManageHeaderProps {
  isPrevButton?: boolean;
}

const ProfileAccountSettingManageHeader: React.FC<
  ProfileAccountSettingManageHeaderProps
> = ({ isPrevButton = true }) => {
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME}
      isActionFunc={!isPrevButton}
      preNodeByState={!isPrevButton && <></>}
    />
  );
};

export default ProfileAccountSettingManageHeader;
