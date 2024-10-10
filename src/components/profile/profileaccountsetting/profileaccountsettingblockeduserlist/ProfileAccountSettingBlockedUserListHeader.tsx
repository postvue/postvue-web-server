import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { ACCOUNT_SETTING_PROFILE_BLOCK_LIST_TAB_NAME } from 'const/TabConfigConst';
import React from 'react';
import styled from 'styled-components';

const ProfileAccountSettingBlockedUserListHeader: React.FC = () => {
  return (
    <ProfileBlockedUserListHeaderContainer>
      <PrevButtonHeaderHeader
        titleName={ACCOUNT_SETTING_PROFILE_BLOCK_LIST_TAB_NAME}
      />
    </ProfileBlockedUserListHeaderContainer>
  );
};

const ProfileBlockedUserListHeaderContainer = styled.div``;

const BoundaryBarStick = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.grey.Grey2};

  position: fixed;
  top: ${({ theme }) => theme.systemSize.header.height};
`;

export default ProfileAccountSettingBlockedUserListHeader;
