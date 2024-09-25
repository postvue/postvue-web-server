import { ReactComponent as SettingHorizontalDotIcon } from 'assets/images/icon/svg/SettingHorizontalDotIcon.svg';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveProfileAccountPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

const AccountOtherSettingButton: React.FC = () => {
  const setIsActiveProfileAccountPopup = useSetRecoilState(
    isActiveProfileAccountPopupAtom,
  );
  return (
    <AccountSettingButtonWrap
      onClick={() => setIsActiveProfileAccountPopup(true)}
    >
      <SettingHorizontalDotIcon />
    </AccountSettingButtonWrap>
  );
};

const AccountSettingButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

export default AccountOtherSettingButton;
