import AccountOtherSettingButton from 'components/common/buttton/AccountOtherSettingButton';
import AccountSettingButton from 'components/common/buttton/AccountSettingButton';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import PrevButtonHeaderHeader from '../layouts/PrevButtonHeaderHeader';

const ProfileAccountHeader: React.FC = () => {
  const param = useParams();
  const username = param.username || '';

  const { data, isLoading } = QueryStateProfileInfo(username);
  return (
    <>
      {!isLoading && username !== '' && data && (
        <PrevButtonHeaderHeader
          titleName={data.username}
          RightButtonNode={
            <ProfileSettingWrap>
              {data.isMe ? (
                <AccountSettingButton />
              ) : (
                <AccountOtherSettingButton />
              )}
            </ProfileSettingWrap>
          }
        />
      )}
    </>
  );
};

const ProfileSettingWrap = styled.div`
  display: flex;
  cursor: pointer;
`;

export default ProfileAccountHeader;
