import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import React from 'react';
import styled from 'styled-components';

import {
  PROFILE_BLOCKED_ACCOUNT_PATH,
  PROFILE_PRIVATE_PROFILE_PATH,
} from 'const/PathConst';
import {
  ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME,
  ACCOUNT_SETTING_PROFILE_BLOCK_LIST_TAB_NAME,
} from 'const/TabConfigConst';
import { useNavigate } from 'react-router-dom';

const ProfileAccountSettingPrivacyBody: React.FC = () => {
  const navigate = useNavigate();
  const settingTabList = [
    {
      tabName: ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME,
      url: PROFILE_PRIVATE_PROFILE_PATH,
    },
    {
      tabName: ACCOUNT_SETTING_PROFILE_BLOCK_LIST_TAB_NAME,
      url: PROFILE_BLOCKED_ACCOUNT_PATH,
    },
  ];

  return (
    <ProfileAccountSettingPrivacyBodyContainer>
      <ProfileAccountSettingPrivacyBodyWrap>
        {settingTabList.map((value, key) => (
          <ProfileAccountSettingElementWrap
            key={key}
            onClick={() => {
              navigate(value.url);
            }}
          >
            <ProfileAccountSettingElementTitle>
              {value.tabName}
            </ProfileAccountSettingElementTitle>
            <ProfileAccountSettingArrowButtonWrap>
              <AccountSettingArrowButtonIcon />
            </ProfileAccountSettingArrowButtonWrap>
          </ProfileAccountSettingElementWrap>
        ))}
      </ProfileAccountSettingPrivacyBodyWrap>
    </ProfileAccountSettingPrivacyBodyContainer>
  );
};

const ProfileAccountSettingPrivacyBodyContainer = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const ProfileAccountSettingPrivacyBodyWrap = styled.div`
    display: flex;
    flex-flow: column;
    gap: ${({ theme }) => theme.systemSize.settingGap};
    padding-top: 35px;
}`;

const ProfileAccountSettingElementWrap = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const ProfileAccountSettingElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

const ProfileAccountSettingArrowButtonWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default ProfileAccountSettingPrivacyBody;
