import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import ProfileAccountSettingHelpCenterBody from 'components/profile/profileaccountsetting/profileaccountsettinghelpcenter/ProfileAccountSettingHelpCenterBody';
import ProfileAccountSettingHelpCenterHeader from 'components/profile/profileaccountsetting/profileaccountsettinghelpcenter/ProfileAccountSettingHelpCenterHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

const ProfileAccountSettingHelpCenterPage: React.FC = () => {
  const { windowWidth } = useWindowSize();
  return (
    <AppBaseTemplate
      hasSearchInputModule={false}
      appContainerWidth={
        windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined
      }
      sideWidth={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined}
      slideBarNode={
        <>
          <ProfileAccountSettingHelpCenterHeader />
          <ProfileAccountSettingHelpCenterBody />
        </>
      }
    >
      <MyAccountSettingInfoState />
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <>
          <ProfileAccountSettingHeader />
          <ProfileAccountSettingBody />
        </>
      ) : (
        <>
          <ProfileAccountSettingHelpCenterHeader />
          <ProfileAccountSettingHelpCenterBody />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingHelpCenterPage;
