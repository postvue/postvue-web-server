import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as PrivateProfileButtonIcon } from 'assets/images/icon/svg/setting/PrivateProfileButtonIcon.svg';
import ToggleSwitchButton from 'components/common/buttton/ToggleSwitchButton';
import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import ConfirmPopup from 'components/popups/ConfirmPopup';
import ToastPopup from 'components/popups/ToastMsgPopup';
import { QueryMutationPutMyPrivateProfileInfo } from 'hook/queryhook/QueryMutationPutMyPrivateProfileInfo';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import { useRecoilState } from 'recoil';
import { isActivePrivateProfileConfirmPopupAtom } from 'states/ProfileAtom';

const ProfileAccountSettingPrivateProfileBody: React.FC = () => {
  const { data, isLoading } = QueryStateMyProfileInfo();

  const [isPrivateProfile, setIsPrivateProfile] = useState<boolean>(false);
  const [
    isActivePrivateProfileConfirmPopup,
    setIsActivePrivateProfileConfirmPopup,
  ] = useRecoilState(isActivePrivateProfileConfirmPopupAtom);
  const putMyPrivateProfileInfoMutation =
    QueryMutationPutMyPrivateProfileInfo();

  const confirmPrivateProfile = () => {
    if (!data) return;
    putMyPrivateProfileInfoMutation.mutate({
      isPrivateProfile: !data.isPrivateProfile,
    });
    setIsActivePrivateProfileConfirmPopup(false);
  };

  useEffect(() => {
    if (!data) return;

    setIsPrivateProfile(data.isPrivateProfile);
  }, [data]);

  return (
    <>
      <MyAccountSettingInfoState />
      {!isLoading && (
        <ProfileEditEmailContainer>
          <ProfileEditEmailInputWrap>
            <ProfilePrivateProfileManageWrap>
              <ProfilePrivateProfileTitleWrap>
                <ProfilePrivateProfileIconWrap>
                  <PrivateProfileButtonIcon />
                </ProfilePrivateProfileIconWrap>
                <ProfilePrivateProfileTitle>
                  비공개 프로필
                </ProfilePrivateProfileTitle>
              </ProfilePrivateProfileTitleWrap>
              <ToggleSwitchButtonWrap>
                <ToggleSwitchButton
                  isActive={isPrivateProfile}
                  actionFunc={() => setIsActivePrivateProfileConfirmPopup(true)}
                />
              </ToggleSwitchButtonWrap>
            </ProfilePrivateProfileManageWrap>
          </ProfileEditEmailInputWrap>
        </ProfileEditEmailContainer>
      )}
      {isActivePrivateProfileConfirmPopup && (
        <ConfirmPopup
          setIsPopup={setIsActivePrivateProfileConfirmPopup}
          confirmPopupTitle={
            isPrivateProfile
              ? '공개 프로필로 전환하시나요?'
              : '비공개 프로필로 전환하시나요?'
          }
          confirmPopupSubTitle={
            isPrivateProfile
              ? '모든 사람들이 회원님의 게시물과 스크랩을 확인할 수 있습니다.'
              : '맞팔된 팔로워만 회원님의 게시물과 스크랩을 확인할 수 있습니다.'
          }
          actionFunc={confirmPrivateProfile}
        />
      )}
      <ToastPopup />
    </>
  );
};

const ProfileEditEmailContainer = styled.div`
  padding-top: calc(${({ theme }) => theme.systemSize.header.height} + 30px);
`;

const ProfileEditEmailInputWrap = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const ProfilePrivateProfileManageWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfilePrivateProfileTitleWrap = styled.div`
  display: flex;
  gap: 11px;
`;

const ProfilePrivateProfileTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const ProfilePrivateProfileIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const ToggleSwitchButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

export default ProfileAccountSettingPrivateProfileBody;
