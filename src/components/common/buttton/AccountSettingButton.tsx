import { ReactComponent as AccountSettingButtonIcon } from 'assets/images/icon/svg/AccountSettingButtonIcon.svg';
import { PROFILE_SETTING_PATH } from 'const/PathConst';
import React from 'react';
import { Link } from 'react-router-dom';

const AccountSettingButton: React.FC = () => {
  return (
    <Link to={PROFILE_SETTING_PATH}>
      <AccountSettingButtonIcon />
    </Link>
  );
};

export default AccountSettingButton;
