import { ReactComponent as AccountSettingButtonIcon } from 'assets/images/icon/svg/AccountSettingButtonIcon.svg';
import { PROFILE_SETTING_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { stackRouterPush } from 'global/util/reactnative/StackRouter';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AccountSettingButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AccountSettingButtonWrap
      onClick={() => stackRouterPush(navigate, PROFILE_SETTING_PATH)}
    >
      <AccountSettingButtonIcon />
    </AccountSettingButtonWrap>
  );
};

const AccountSettingButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: -25px;
    bottom: -25px;
    left: -25px;
    right: -25px;
    z-index: -1; /* 가상 요소를 버튼 뒤로 배치 */
    background: transparent; /* 투명 */
  }
`;

export default AccountSettingButton;
