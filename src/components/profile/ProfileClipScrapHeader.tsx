import HeaderLayout from 'components/layouts/HeaderLayout';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../const/ClassNameConst';
import MyAccountSettingInfoState from '../common/state/MyAccountSettingInfoState';

import TabStickBar from 'components/common/container/TabStickBar';
import SearchTabComponent from 'components/home/header/SearchTabComponent';
import {
  PROFILE_CLIP_TAB_ID,
  PROFILE_CLIP_TAB_NAME,
  PROFILE_SCRAP_TAB_ID,
  PROFILE_SCRAP_TAB_NAME,
} from 'const/TabConfigConst';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import { useRecoilState } from 'recoil';
import { scrapTabInfoAtom } from 'states/ProfileAtom';

const ProfileClipScrapHeader: React.FC = () => {
  const { data: myAccountSettingInfo } = QueryStateMyProfileInfo();

  const navigate = useNavigate();

  const ProfileTabWrapRef = useRef<HTMLDivElement>(null);

  const [scrapTabInfo, setScrapTabInfo] = useRecoilState(scrapTabInfoAtom);

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
            {/* <ProfileAccountButtonImg
              src={myAccountSettingInfo?.profilePath}
              alt={myAccountSettingInfo?.username}
              onClick={() =>
                stackRouterPush(
                  navigate,
                  `${PROFILE_LIST_PATH}/${myAccountSettingInfo?.username}`,
                )
              }
            /> */}
          </ProfileAccountButton>
          <ProfileCategoryContainer>
            <ProfileCategoryWrap ref={ProfileTabWrapRef}>
              <ProfileClipButton
                className={
                  scrapTabInfo.activeTabId === PROFILE_CLIP_TAB_ID
                    ? ACTIVE_CLASS_NAME
                    : ''
                }
                onClick={() => {
                  setScrapTabInfo({
                    activeTabId: PROFILE_CLIP_TAB_ID,
                    scrollInfo: {
                      isActive: false,
                      scroll: 0,
                    },
                  });
                }}
              >
                {PROFILE_CLIP_TAB_NAME}
                {scrapTabInfo.activeTabId === PROFILE_CLIP_TAB_ID && (
                  <TabStickBar />
                )}
              </ProfileClipButton>

              <ProfileScrapButton
                className={
                  scrapTabInfo.activeTabId === PROFILE_SCRAP_TAB_ID
                    ? ACTIVE_CLASS_NAME
                    : ''
                }
                onClick={() => {
                  setScrapTabInfo({
                    activeTabId: PROFILE_SCRAP_TAB_ID,
                    scrollInfo: {
                      isActive: false,
                      scroll: 0,
                    },
                  });
                }}
              >
                {PROFILE_SCRAP_TAB_NAME}
                {scrapTabInfo.activeTabId === PROFILE_SCRAP_TAB_ID && (
                  <TabStickBar />
                )}
              </ProfileScrapButton>
            </ProfileCategoryWrap>
          </ProfileCategoryContainer>
          <ProfileSettingButton>
            {/* <AccountSettingButton /> */}
            <SearchTabComponent />
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
