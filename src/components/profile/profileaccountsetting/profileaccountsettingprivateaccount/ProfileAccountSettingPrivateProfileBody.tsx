import React from 'react';
import styled from 'styled-components';

import { ReactComponent as PrivateProfileButtonIcon } from 'assets/images/icon/svg/setting/PrivateProfileButtonIcon.svg';
import ToggleSwitchButton from 'components/common/buttton/ToggleSwitchButton';
import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';

interface ProfileAccountSettingPrivateProfileBodyProps {
  onActivePopup: () => void;
  isPrivateProfile: boolean;
}

const ProfileAccountSettingPrivateProfileBody: React.FC<
  ProfileAccountSettingPrivateProfileBodyProps
> = ({ isPrivateProfile, onActivePopup }) => {
  const { isLoading } = QueryStateMyProfileInfo();

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
                  actionFunc={() => onActivePopup()}
                />
              </ToggleSwitchButtonWrap>
            </ProfilePrivateProfileManageWrap>
            <PrivatePolicyContent>
              프로필을 비공개로 설정하면, 다른 사람들한테 계정이 비공개로
              보여집니다. 그러나 게시물이랑 스크랩 자체는 비공개로 전환되지
              않습니다.
            </PrivatePolicyContent>
          </ProfileEditEmailInputWrap>
        </ProfileEditEmailContainer>
      )}
    </>
  );
};

const ProfileEditEmailContainer = styled.div`
  padding-top: 30px;
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

const PrivatePolicyContent = styled.div`
  padding-top: 10px;
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey6};
`;

export default ProfileAccountSettingPrivateProfileBody;
