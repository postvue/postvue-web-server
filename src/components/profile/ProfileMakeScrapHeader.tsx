import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import React from 'react';

interface ProfileMakeScrapHeaderProps {
  HeaderLayoutStyle?: React.CSSProperties;
  isActionFunc?: boolean;
  actionFunc?: () => void;
}

const ProfileMakeScrapHeader: React.FC<ProfileMakeScrapHeaderProps> = ({
  HeaderLayoutStyle,
  isActionFunc = false,
  actionFunc,
}) => {
  return (
    <PrevButtonHeaderHeader
      titleName={'신규 스크랩 추가'}
      HeaderLayoutStyle={HeaderLayoutStyle}
      isActionFunc={isActionFunc}
      actionFunc={actionFunc}
    />
  );
};

export default ProfileMakeScrapHeader;
