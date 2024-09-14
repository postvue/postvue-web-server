import HeaderLayout from 'components/layouts/HeaderLayout';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../const/ClassNameConst';
import {
  PROFILE_CLIP_LIST_PATH,
  PROFILE_LIST_PATH,
  PROFILE_SCRAP_LIST_PATH,
} from '../../const/PathConst';
import { myProfileSettingInfoAtom } from '../../states/ProfileAtom';
import MyAccountSettingInfoState from '../common/state/MyAccountSettingInfoState';

import AccountSettingButton from 'components/common/buttton/AccountSettingButton';

const ProfileClipScrapHeader: React.FC = () => {
  const [myAccountSettingInfo, setMyAccountSettingInfo] = useRecoilState(
    myProfileSettingInfoAtom,
  );

  const [currentPathName, setCurrentPathName] = useState<string>(
    location.pathname,
  );
  const navigate = useNavigate();

  return (
    <>
      <HeaderLayout>
        <MyAccountSettingInfoState />
        <ProfileClipScrapHeaderWrap>
          <ProfileAccountButton>
            <ProfileAccountButtonImg
              src={myAccountSettingInfo.profilePath}
              alt={myAccountSettingInfo.username}
              onClick={() =>
                navigate(
                  `${PROFILE_LIST_PATH}/${myAccountSettingInfo.username}`,
                )
              }
            />
          </ProfileAccountButton>
          <ProfileCategoryContainer>
            <ProfileCategoryWrap>
              <ProfileClipButton
                className={
                  currentPathName === PROFILE_CLIP_LIST_PATH
                    ? ACTIVE_CLASS_NAME
                    : ''
                }
                onClick={() => {
                  navigate(PROFILE_CLIP_LIST_PATH);
                }}
              >
                클립
              </ProfileClipButton>

              <ProfileScrapButton
                className={
                  currentPathName === PROFILE_SCRAP_LIST_PATH
                    ? ACTIVE_CLASS_NAME
                    : ''
                }
                onClick={() => {
                  navigate(PROFILE_SCRAP_LIST_PATH);
                }}
              >
                스크랩
              </ProfileScrapButton>
            </ProfileCategoryWrap>
          </ProfileCategoryContainer>
          <ProfileSettingButton>
            <AccountSettingButton />
          </ProfileSettingButton>
        </ProfileClipScrapHeaderWrap>
      </HeaderLayout>
    </>
  );
};

const ProfileClipScrapHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.header.paddingLeftRightMargin};
  width: 100%;
`;

const ProfileAccountButton = styled.div`
  margin: auto 0px;
`;

const ProfileAccountButtonImg = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 20px;
  cursor: pointer;
`;

const ProfileSettingButton = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

const ProfileCategoryContainer = styled.div`
  position: fixed;
  transform: translate(-50%, 50%);
  top: 0;
  left: 50%;
`;

const ProfileCategoryWrap = styled.div`
  display: flex;
  gap: 22px;
`;

const ProfileClipButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  color: ${({ theme }) => theme.grey.Grey4};
  cursor: pointer;
  &.active {
    color: black;
    text-decoration: underline;
    text-underline-offset: 10px;
    text-decoration-thickness: px;
  }
`;

const ProfileScrapButton = styled(ProfileClipButton)``;

export default ProfileClipScrapHeader;
