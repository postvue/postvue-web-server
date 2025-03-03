import ProfileAccountSettingBlockedUserListHeader from 'components/profile/profileaccountsetting/profileaccountsettingblockeduserlist/ProfileAccountSettingBlockedUserListHeader';
import ProfileAccountSettingBlockListBody from 'components/profile/profileaccountsetting/profileaccountsettingblockeduserlist/ProfileAccountSettingBlockListBody';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const ProfileBlockedUserListManagePage: React.FC = () => {
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
          <ProfileAccountSettingBlockedUserListHeader />
          <ProfileAccountSettingBlockListBody />
        </>
      }
    >
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <>
          <ProfileAccountSettingHeader />
          <ProfileAccountSettingBody />
        </>
      ) : (
        <>
          <ProfileAccountSettingBlockedUserListHeader />
          <ProfileAccountSettingBlockListBody />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileBlockedUserListManagePage;
