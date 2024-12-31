import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import React from 'react';
import styled from 'styled-components';

import {
  HOME_PATH,
  PROFILE_BIRTHDATE_EDIT_PATH,
  PROFILE_DELETE_ACCOUNT_PATH,
  PROFILE_EMAIL_EDIT_PATH,
  PROFILE_GENDER_EDIT_PATH,
  PROFILE_PASSWORD_EDIT_PATH,
} from 'const/PathConst';
import {
  ACCOUNT_SETTING_BIRTHDATE_EDIT_TAB_NAME,
  ACCOUNT_SETTING_DELETE_ACCOUNT_TAB_NAME,
  ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME,
  ACCOUNT_SETTING_GENDER_EDIT_TAB_NAME,
  ACCOUNT_SETTING_PASSWORD_EDIT_TAB_NAME,
} from 'const/TabConfigConst';
import { resetAccountInfoByLogout } from 'global/util/AuthUtil';
import { resetNotificationMsgListByLocalStorage } from 'global/util/NotificationUtil';
import {
  isApp,
  stackRouterLogout,
  stackRouterPush,
} from 'global/util/reactnative/StackRouter';
import { useNavigate } from 'react-router-dom';
import { postAuthLogout } from 'services/auth/postAuthLogout';

const ProfileAccountSettingManageBody: React.FC = () => {
  const navigate = useNavigate();
  const settingTabList = [
    {
      tabName: ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME,
      url: PROFILE_EMAIL_EDIT_PATH,
    },
    {
      tabName: ACCOUNT_SETTING_BIRTHDATE_EDIT_TAB_NAME,
      url: PROFILE_BIRTHDATE_EDIT_PATH,
    },
    {
      tabName: ACCOUNT_SETTING_GENDER_EDIT_TAB_NAME,
      url: PROFILE_GENDER_EDIT_PATH,
    },
    {
      tabName: ACCOUNT_SETTING_PASSWORD_EDIT_TAB_NAME,
      url: PROFILE_PASSWORD_EDIT_PATH,
    },
    {
      tabName: ACCOUNT_SETTING_DELETE_ACCOUNT_TAB_NAME,
      url: PROFILE_DELETE_ACCOUNT_PATH,
    },
  ];

  const onClickLogout = () => {
    postAuthLogout()
      .then(() => {
        resetAccountInfoByLogout();
        resetNotificationMsgListByLocalStorage();
        if (isApp()) {
          stackRouterLogout();
        } else {
          location.href = HOME_PATH;
        }
      })
      .catch(() => {
        alert('오류로 인해 로그아웃에 실패했습니다. 다시 시도해주세요.');
      });
  };
  return (
    <ProfileAccountSettingBodyContainer>
      <ProfileAccountSettingBodyWrap>
        {settingTabList.map((value, key) => (
          <ProfileAccountSettingElementWrap
            key={key}
            onClick={() => {
              stackRouterPush(navigate, value.url);
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
      <ProfileLogoutButtonWrap>
        <ProfileLogoutButton onClick={onClickLogout}>
          로그아웃
        </ProfileLogoutButton>
      </ProfileLogoutButtonWrap>
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

const ProfileLogoutButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const ProfileLogoutButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey3};
  cursor: pointer;
`;

export default ProfileAccountSettingManageBody;
