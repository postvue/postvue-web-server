import { ReactComponent as AccountSettingButtonIcon } from 'assets/images/icon/svg/AccountSettingButtonIcon.svg';
import { PROFILE_SETTING_PATH } from 'const/PathConst';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AccountSettingButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AccountSettingButtonWrap onClick={() => navigate(PROFILE_SETTING_PATH)}>
      <AccountSettingButtonIcon />
    </AccountSettingButtonWrap>
  );
};

const AccountSettingButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

export default AccountSettingButton;
