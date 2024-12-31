import HeaderLayout from 'components/layouts/HeaderLayout';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../const/ClassNameConst';
import {
  PROFILE_CLIP_LIST_PATH,
  PROFILE_LIST_PATH,
  PROFILE_SCRAP_LIST_PATH,
} from '../../const/PathConst';
import MyAccountSettingInfoState from '../common/state/MyAccountSettingInfoState';

import AccountSettingButton from 'components/common/buttton/AccountSettingButton';
import TabStickBar from 'components/common/container/TabStickBar';
import { stackRouterPush } from 'global/util/reactnative/StackRouter';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';

const ProfileClipScrapHeader: React.FC = () => {
  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();

  const currentPathName = location.pathname;

  const navigate = useNavigate();

  const ProfileTabWrapRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <HeaderLayout
        HeaderLayoutStyle={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >
        <MyAccountSettingInfoState />
        <ProfileClipScrapHeaderWrap>
          <ProfileAccountButton>
            <ProfileAccountButtonImg
              src={myAccountSettingInfo?.profilePath}
              alt={myAccountSettingInfo?.username}
              onClick={() =>
                stackRouterPush(
                  navigate,
                  `${PROFILE_LIST_PATH}/${myAccountSettingInfo?.username}`,
                )
              }
            />
          </ProfileAccountButton>
          <ProfileCategoryContainer>
            <ProfileCategoryWrap ref={ProfileTabWrapRef}>
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
                {currentPathName === PROFILE_CLIP_LIST_PATH && <TabStickBar />}
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
                {currentPathName === PROFILE_SCRAP_LIST_PATH && <TabStickBar />}
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

const ProfileImgSize = 38;
const ProfileClipScrapHeaderWrap = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.header.paddingLeftRightMargin};
  width: 100%;
`;

const ProfileAccountButton = styled.div`
  margin: auto 0px;
  width: ${ProfileImgSize}px;
  height: ${ProfileImgSize}px;
`;

const ProfileAccountButtonImg = styled.img`
  width: ${ProfileImgSize}px;
  height: ${ProfileImgSize}px;
  border-radius: 20px;
  cursor: pointer;
  object-fit: cover;
`;

const ProfileSettingButton = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
  position: relative;
  z-index: 1000;
`;

const ProfileCategoryContainer = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`;

const ProfileCategoryWrap = styled.div`
  display: flex;
  gap: 22px;
`;

const ProfileClipButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey4};
  cursor: pointer;
  &.active {
    color: black;
  }
`;

const ProfileScrapButton = styled(ProfileClipButton)``;

export default ProfileClipScrapHeader;
