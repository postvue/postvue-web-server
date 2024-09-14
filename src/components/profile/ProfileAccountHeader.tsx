import { useQuery } from '@tanstack/react-query';
import AccountSettingButton from 'components/common/buttton/AccountSettingButton';
import {
  QUERY_STATE_PROFILE_ACCOUNT_INFO,
  SERACH_FAVORITE_TERMS_STALE_TIME,
} from 'const/QueryClientConst';
import { ProfileInfo } from 'global/interface/profile';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getProfileInfo } from 'services/profile/getProfileInfo';
import styled from 'styled-components';
import PrevButtonHeaderHeader from '../layouts/PrevButtonHeaderHeader';

const ProfileAccountHeader: React.FC = () => {
  const param = useParams();
  const username = param.username || '';
  const { data, isLoading } = useQuery<ProfileInfo>({
    queryKey: [QUERY_STATE_PROFILE_ACCOUNT_INFO, username],
    queryFn: () => getProfileInfo(username),
    staleTime: SERACH_FAVORITE_TERMS_STALE_TIME,
  });

  return (
    <>
      {!isLoading && username !== '' && data && (
        <PrevButtonHeaderHeader
          titleName={data.username}
          RightButtonNode={
            <ProfileSettingWrap>
              <AccountSettingButton />
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
