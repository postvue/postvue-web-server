import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import ConfirmPopup from 'components/popups/ConfirmPopup';
import ProfileAccountSettingBody from 'components/profile/profileaccountsetting/ProfileAccountSettingBody';
import ProfileAccountSettingHeader from 'components/profile/profileaccountsetting/ProfileAccountSettingHeader';
import ProfileAccountSettingPrivateProfileBody from 'components/profile/profileaccountsetting/profileaccountsettingprivateaccount/ProfileAccountSettingPrivateProfileBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME } from 'const/TabConfigConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryMutationPutMyPrivateProfileInfo } from 'hook/queryhook/QueryMutationPutMyPrivateProfileInfo';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isActivePrivateProfileConfirmPopupAtom } from 'states/ProfileAtom';

const ProfileAccountPrivateProfilePage: React.FC = () => {
  const { windowWidth } = useWindowSize();

  const [
    isActivePrivateProfileConfirmPopup,
    setIsActivePrivateProfileConfirmPopup,
  ] = useRecoilState(isActivePrivateProfileConfirmPopupAtom);

  const putMyPrivateProfileInfoMutation =
    QueryMutationPutMyPrivateProfileInfo();

  const { data } = QueryStateMyProfileInfo();

  useEffect(() => {
    if (!data) return;

    setIsPrivateProfile(data.isPrivateProfile);
  }, [data]);

  const confirmPrivateProfile = () => {
    if (!data) return;
    putMyPrivateProfileInfoMutation.mutate({
      isPrivateProfile: !data.isPrivateProfile,
    });
    setIsActivePrivateProfileConfirmPopup(false);
  };

  const [isPrivateProfile, setIsPrivateProfile] = useState<boolean>(false);
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
          <PrevButtonHeaderHeader
            titleName={ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME}
          />
          <ProfileAccountSettingPrivateProfileBody
            isPrivateProfile={isPrivateProfile}
            onActivePopup={() => setIsActivePrivateProfileConfirmPopup(true)}
          />
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
          <PrevButtonHeaderHeader
            titleName={ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME}
          />
          <ProfileAccountSettingPrivateProfileBody
            isPrivateProfile={isPrivateProfile}
            onActivePopup={() => setIsActivePrivateProfileConfirmPopup(true)}
          />
        </>
      )}
      {isActivePrivateProfileConfirmPopup && (
        <ConfirmPopup
          onClose={() => setIsActivePrivateProfileConfirmPopup(false)}
          confirmPopupTitle={
            isPrivateProfile
              ? '공개 프로필로 전환하시나요?'
              : '비공개 프로필로 전환하시나요?'
          }
          confirmPopupSubTitle={
            isPrivateProfile
              ? '모든 사람들이 회원님의 게시물과 스크랩을 확인할 수 있습니다.'
              : '모든 사람들에게 계정이 비공개로 보여집니다.'
          }
          actionFunc={confirmPrivateProfile}
        />
      )}
    </AppBaseTemplate>
  );
};

export default ProfileAccountPrivateProfilePage;
