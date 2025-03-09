import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { MEDIA_MIDDLE_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';

const ProfileAccountSettingHeader: React.FC = () => {
  const { windowWidth } = useWindowSize();
  return (
    <PrevButtonHeaderHeader
      titleName="환경설정"
      isActionFunc={windowWidth >= MEDIA_MIDDLE_WIDTH_NUM}
      preNodeByState={windowWidth >= MEDIA_MIDDLE_WIDTH_NUM && <></>}
    />
  );
};

export default ProfileAccountSettingHeader;
