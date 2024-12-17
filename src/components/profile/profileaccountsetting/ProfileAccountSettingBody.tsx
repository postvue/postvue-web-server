import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import React from 'react';
import styled from 'styled-components';

import {
  PROFILE_EDIT_PATH,
  PROFILE_MANAGE_PATH,
  PROFILE_PRIVACY_POLICY_PATH,
} from 'const/PathConst';
import {
  ACCOUNT_SETTING_CONTACT_TAB_NAME,
  ACCOUNT_SETTING_NOTICE_SERVIDE_TAB_NAME,
  ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME,
  ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME,
  ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME,
  ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME,
  ACCOUNT_SETTING_PROFILE_NOTIFICATIONS_TAB_NAME,
  ACCOUNT_SETTING_TERMS_OF_SERVICE_TAB_NAME,
} from 'const/TabConfigConst';
import { useNavigate } from 'react-router-dom';

const ProfileAccountSettingBody: React.FC = () => {
  const navigate = useNavigate();
  const settingTabList = [
    { tabName: ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME, url: PROFILE_EDIT_PATH },
    {
      tabName: ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME,
      url: PROFILE_MANAGE_PATH,
    },
    {
      tabName: ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME,
      url: PROFILE_PRIVACY_POLICY_PATH,
    },
    { tabName: ACCOUNT_SETTING_PROFILE_NOTIFICATIONS_TAB_NAME, url: '' },
    { tabName: ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME, url: '' },
    { tabName: ACCOUNT_SETTING_TERMS_OF_SERVICE_TAB_NAME, url: '' },
    { tabName: ACCOUNT_SETTING_NOTICE_SERVIDE_TAB_NAME, url: '' },
    { tabName: ACCOUNT_SETTING_CONTACT_TAB_NAME, url: '' },
  ];

  return (
    <ProfileAccountSettingBodyContainer>
      <ProfileAccountSettingBodyWrap>
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
      </ProfileAccountSettingBodyWrap>
    </ProfileAccountSettingBodyContainer>
  );
};

const ProfileAccountSettingBodyContainer = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const ProfileAccountSettingBodyWrap = styled.div`
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

export default ProfileAccountSettingBody;
