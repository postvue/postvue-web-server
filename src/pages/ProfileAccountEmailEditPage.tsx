import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import ProfileAccountEmailEditBody from 'components/profile/profileaccountsetting/profileaccountsettingmanage/email/ProfileAccountEmailEditBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME } from 'const/TabConfigConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

const ProfileAccountEmailEditPage: React.FC = () => {
  const { windowWidth } = useWindowSize();

  return (
    <AppBaseTemplate
      hasSearchInputModule={false}
      isAppInsetTopMargin={false}
      appContainerWidth={
        windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined
      }
      sideWidth={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? 500 : undefined}
      slideBarNode={
        <>
          <PrevButtonHeaderHeader
            titleName={ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME}
          />
          <ProfileAccountEmailEditBody />
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
          <PrevButtonHeaderHeader
            titleName={ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME}
          />
          <ProfileAccountEmailEditBody />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileAccountEmailEditPage;
