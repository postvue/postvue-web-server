import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import MyProfileEditBody from 'components/profile/myprofileedit/MyProfileEditBody';
import MyProfileEditHeader from 'components/profile/myprofileedit/MyProfileEditHeader';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

const ProfileAccountSettingEditPage: React.FC = () => {
  const { windowWidth } = useWindowSize();

  return (
    <AppBaseTemplate
      isAppInsetTopMargin={false}
      hasSearchInputModule={false}
      appContainerWidth={
        windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined
      }
      sideWidth={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined}
      slideBarNode={
        <>
          <MyProfileEditHeader />
          <MyProfileEditBody />
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
          <MyProfileEditHeader />
          <MyProfileEditBody />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingEditPage;
