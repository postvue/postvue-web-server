import AccountShareButton from 'components/common/buttton/AccountShareButton';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { myProfileScrapInfoAtom } from 'states/ProfileAtom';

const ProfileScrapHeader: React.FC = () => {
  const profileScrapInfo = useRecoilValue(myProfileScrapInfoAtom);
  return (
    <PrevButtonHeaderHeader
      titleName=""
      RightButtonNode={
        <AccountShareButton
          url={window.location.href}
          text={profileScrapInfo.scrapName}
        />
      }
    />
  );
};

export default ProfileScrapHeader;
