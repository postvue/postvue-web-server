import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import ProfileAccountSettingPrivacyBody from 'components/profile/profileaccountsetting/profileaccountsettingprivacy/ProfileAccountSettingPrivacyBody';
import ProfileAccountSettingPrivacyHeader from 'components/profile/profileaccountsetting/profileaccountsettingprivacy/ProfileAccountSettingPrivacyHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

const ProfileAccountSettingPrivacyPage: React.FC = () => {
  const { windowWidth } = useWindowSize();
  return (
    <AppBaseTemplate
      hasSearchInputModule={false}
      appContainerWidth={
        windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined
      }
      sideWidth={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined}
      SlideBarNodeStyle={{ borderRadius: 0 }}
      slideBarNode={
        <>
          <ProfileAccountSettingPrivacyHeader isPrevButton={false} />
          <ProfileAccountSettingPrivacyBody />
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
          <ProfileAccountSettingPrivacyHeader />
          <ProfileAccountSettingPrivacyBody />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingPrivacyPage;
