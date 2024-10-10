import HeaderLayout from 'components/layouts/HeaderLayout';
import React, { useEffect, useRef, useState } from 'react';
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
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';

const ProfileClipScrapHeader: React.FC = () => {
  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();

  const [currentPathName, setCurrentPathName] = useState<string>(
    location.pathname,
  );
  const navigate = useNavigate();

  const ProfileTabWrapRef = useRef<HTMLDivElement>(null);

  const [tabHeight, setTabHeight] = useState<number>(0);

  useEffect(() => {
    if (!ProfileTabWrapRef.current) return;
    setTabHeight(ProfileTabWrapRef.current.offsetHeight);
  }, [ProfileTabWrapRef.current]);

  return (
    <>
      <HeaderLayout>
        <MyAccountSettingInfoState />
        <ProfileClipScrapHeaderWrap>
          <ProfileAccountButton>
            <ProfileAccountButtonImg
              src={myAccountSettingInfo?.profilePath}
              alt={myAccountSettingInfo?.username}
              onClick={() =>
                navigate(
                  `${PROFILE_LIST_PATH}/${myAccountSettingInfo?.username}`,
                )
              }
            />
          </ProfileAccountButton>
          <ProfileCategoryContainer $tabHeight={tabHeight}>
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
`;

const ProfileSettingButton = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

const ProfileCategoryContainer = styled.div<{ $tabHeight: number }>`
  position: absolute;
  transform: translate(-50%, 50%);
  top: calc(50% - ${(props) => props.$tabHeight}px);
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
