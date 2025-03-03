import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import ProfileAccountSettingManageBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/ProfileAccountSettingManageBody';
import ProfileAccountSettingManageHeader from 'components/profile/profileaccountsetting/profileaccountsettingmanage/ProfileAccountSettingManageHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';

import React from 'react';

const ProfileAccountSettingManagePage: React.FC = () => {
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
          <ProfileAccountSettingManageHeader />
          <ProfileAccountSettingManageBody />
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
          <ProfileAccountSettingManageHeader />
          <ProfileAccountSettingManageBody />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingManagePage;
