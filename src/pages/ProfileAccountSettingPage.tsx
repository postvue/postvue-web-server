import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import { PROFILE_EDIT_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileAccountSettingPage: React.FC = () => {
  const { windowWidth } = useWindowSize();
  const navigate = useNavigate();
  useEffect(() => {
    if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
      navigate(PROFILE_EDIT_PATH, { replace: true });
    }
  }, []);
  return (
    <AppBaseTemplate>
      <MyAccountSettingInfoState />
      <ProfileAccountSettingHeader />
      <ProfileAccountSettingBody />
    </AppBaseTemplate>
  );
};

export default ProfileAccountSettingPage;
