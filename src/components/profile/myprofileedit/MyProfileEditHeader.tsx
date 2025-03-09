import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME } from 'const/TabConfigConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

interface MyProfileEditHeaderProps {
  isPrevButton?: boolean;
}

const MyProfileEditHeader: React.FC<MyProfileEditHeaderProps> = ({
  isPrevButton = true,
}) => {
  const { windowWidth } = useWindowSize();
  return (
    <PrevButtonHeaderHeader
      titleName={ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME}
      isActionFunc={!isPrevButton}
      preNodeByState={!isPrevButton && <></>}
    />
  );
};

export default MyProfileEditHeader;
