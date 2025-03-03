import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import React from 'react';
import styled from 'styled-components';

import {
  PROFILE_EDIT_PATH,
  PROFILE_MANAGE_PATH,
  PROFILE_PRIVACY_POLICY_PATH,
  PROFILE_PRIVATE_HELP_CENTER_PATH,
} from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import {
  ACCOUNT_SETTING_HELP_CENTER_TAB_NAME,
  ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME,
  ACCOUNT_SETTING_PRIVACY_POLICY_URL,
  ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME,
  ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME,
  ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME,
  ACCOUNT_SETTING_TERMS_OF_SERVICE_TAB_NAME,
  ACCOUNT_SETTING_TERMS_OF_SERVICE_URL,
  ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_TAB_NAME,
  ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_URL,
} from 'const/TabConfigConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import { useNavigate } from 'react-router-dom';
import { hoverComponentStyle } from 'styles/commonStyles';
import theme from 'styles/theme';

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
    // { tabName: ACCOUNT_SETTING_PROFILE_NOTIFICATIONS_TAB_NAME, url: '' },
    {
      tabName: ACCOUNT_SETTING_TERMS_OF_SERVICE_TAB_NAME,
      url: ACCOUNT_SETTING_TERMS_OF_SERVICE_URL,
    },
    {
      tabName: ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME,
      url: ACCOUNT_SETTING_PRIVACY_POLICY_URL,
    },
    {
      tabName: ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_TAB_NAME,
      url: ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_URL,
    },
    {
      tabName: ACCOUNT_SETTING_HELP_CENTER_TAB_NAME,
      url: PROFILE_PRIVATE_HELP_CENTER_PATH,
    },
  ];

  const { windowWidth } = useWindowSize();

  const { data: myProfileInfo } = QueryStateMyProfileInfo();

  return (
    <ProfileAccountSettingBodyContainer>
      <ProfileAccountSettingBodyWrap>
        {settingTabList.map((value, key) => (
          <ProfileAccountSettingElementWrap
            key={key}
            onClick={() => {
              if (
                value.tabName === ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME ||
                value.tabName === ACCOUNT_SETTING_TERMS_OF_SERVICE_TAB_NAME ||
                value.tabName ===
                  ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_TAB_NAME
              ) {
                window.open(value.url, '_blank', 'noopener,noreferrer');
              } else {
                stackRouterPush(navigate, value.url);
              }
            }}
            $isActivePc={
              windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM &&
              location.pathname === value.url
            }
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

const ProfileAccountSettingBodyContainer = styled.div``;

const ProfileAccountSettingBodyWrap = styled.div`
    display: flex;
    flex-flow: column;
    padding-top: 20px;
}`;

const ProfileAccountSettingElementWrap = styled.div<{ $isActivePc: boolean }>`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 15px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};

  background: ${(props) => (props.$isActivePc ? theme.grey.Grey1 : 'white')};
  border-radius: ${(props) => (props.$isActivePc ? '20px' : '')};

  ${hoverComponentStyle}
`;

const ProfileAccountSettingElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

const ProfileAccountSettingArrowButtonWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default ProfileAccountSettingBody;
