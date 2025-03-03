import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { MEDIA_MIDDLE_WIDTH_NUM } from 'const/SystemAttrConst';
import { ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME } from 'const/TabConfigConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

const ProfileAccountSettingManageHeader: React.FC = () => {
  const { windowWidth } = useWindowSize();
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME}
      isActionFunc={windowWidth >= MEDIA_MIDDLE_WIDTH_NUM}
    />
  );
};

export default ProfileAccountSettingManageHeader;
