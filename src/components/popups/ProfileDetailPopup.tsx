import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import ProfileAccountBodyLayout from 'components/profile/profileaccount/ProfileAccountBodyLayout';
import ProfileAccountHeader from 'components/profile/profileaccount/ProfileAccountHeader';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { profileDetailInfoPopupAtom } from 'states/ProfileAtom';
import theme from 'styles/theme';
import ProfileDetailPopupLayout from './ProfileDetailPopupLayout';

const ProfileDetailPopup: React.FC = () => {
  const goBackOrNavigate = useGoBackOrNavigate(location.pathname);

  const [profileDetailInfoPopup, setProfileDetailInfoPopup] = useRecoilState(
    profileDetailInfoPopupAtom,
  );
  const resetProfileDetailInfoPopup = useResetRecoilState(
    profileDetailInfoPopupAtom,
  );

  useEffect(() => {
    return () => {
      resetProfileDetailInfoPopup();
    };
  }, []);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          onClose={() => {
            resetProfileDetailInfoPopup();
            goBackOrNavigate();
          }}
          popupContentWrapStyle={{
            overflowY: 'scroll',
            padding: 0,
            marginTop: '10px',
          }}
        >
          <ProfileAccountHeader
            username={profileDetailInfoPopup.username}
            HeaderLayoutStyle={{ backgroundColor: 'transparent' }}
          />
          <ProfileAccountBodyLayout
            ProfileAccountBodyContainerStyle={{
              height: '100dvh',
              overflow: 'auto',
              borderRadius: '0 0 20px 20px',
            }}
            username={profileDetailInfoPopup.username}
          />
        </RoundSquareCenterPopupLayout>
      ) : (
        <ProfileDetailPopupLayout
          isOpen={profileDetailInfoPopup.isActive}
          onClose={() => {
            resetProfileDetailInfoPopup();
          }}
        >
          <ProfileAccountHeader username={profileDetailInfoPopup.username} />
          <ProfileAccountBodyLayout
            username={profileDetailInfoPopup.username}
            ProfileAccountBodyContainerStyle={{
              marginTop: theme.systemSize.header.height,
            }}
          />
        </ProfileDetailPopupLayout>
      )}
    </>
  );
};

export default ProfileDetailPopup;
