import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import React from 'react';
import styled from 'styled-components';

import { APP_CONTACT_EMAIL, APP_SERVICE_NAME } from 'const/AppInfoConst';
import { PROFILE_PRIVATE_HELP_CENTER_INFO_ROUTE_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import {
  ACCOUNT_SETTING_CONPANY_INFO_TAB_NAME,
  ACCOUNT_SETTING_CONTACT_TAB_NAME,
} from 'const/TabConfigConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import { useNavigate } from 'react-router-dom';
import { hoverComponentNotRoundStyle } from 'styles/commonStyles';
import theme from 'styles/theme';

const ProfileAccountSettingHelpCenterBody: React.FC = () => {
  const navigate = useNavigate();
  const settingTabList = [
    { tabName: ACCOUNT_SETTING_CONTACT_TAB_NAME, url: '' },
    {
      tabName: ACCOUNT_SETTING_CONPANY_INFO_TAB_NAME,
      url: PROFILE_PRIVATE_HELP_CENTER_INFO_ROUTE_PATH,
    },
  ];

  const { windowWidth } = useWindowSize();

  const { data: myProfileInfo } = QueryStateMyProfileInfo();

  return (
    <ProfileAccountSettingHelpCenterBodyContainer>
      <ProfileAccountSettingHelpCenterBodyWrap>
        {settingTabList.map((value, key) => (
          <ProfileAccountSettingElementWrap
            key={key}
            onClick={() => {
              if (value.tabName === ACCOUNT_SETTING_CONTACT_TAB_NAME) {
                location.href =
                  'mailto:' +
                  APP_CONTACT_EMAIL +
                  '?cc=' +
                  `${myProfileInfo?.username}` +
                  '&subject=' +
                  `[${APP_SERVICE_NAME}] 전할사항이 있어요!` +
                  '&body=' +
                  `안녕하세요, ${APP_SERVICE_NAME}입니다. 어떤 내용을 ${APP_SERVICE_NAME}에게 전달하고 싶은신가요? 자유롭게 작성해주시면 확인 후 답변 드리겠습니다. 감사합니다. ❣️`;
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
      </ProfileAccountSettingHelpCenterBodyWrap>
    </ProfileAccountSettingHelpCenterBodyContainer>
  );
};

const ProfileAccountSettingHelpCenterBodyContainer = styled.div``;

const ProfileAccountSettingHelpCenterBodyWrap = styled.div`
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
  ${hoverComponentNotRoundStyle}
`;

const ProfileAccountSettingElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

const ProfileAccountSettingArrowButtonWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default ProfileAccountSettingHelpCenterBody;
