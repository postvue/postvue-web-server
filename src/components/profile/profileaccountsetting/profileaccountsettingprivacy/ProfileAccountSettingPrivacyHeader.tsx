import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME } from 'const/TabConfigConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

const ProfileAccountSettingPrivacyHeader: React.FC = () => {
  const { windowWidth } = useWindowSize();
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME}
      isActionFunc={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM}
    />
  );
};

export default ProfileAccountSettingPrivacyHeader;
