import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileFollowListBody from 'components/profile/followlist/ProfileFollowListBody';
import ProfileFollowListHeader from 'components/profile/followlist/ProfileFollowListHeader';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React from 'react';
import { useParams } from 'react-router-dom';

const ProfileFollowListPage: React.FC = () => {
  const params = useParams();
  const username = params.username || '';
  const { isFetched } = QueryStateProfileInfo(username);
  return (
    <AppBaseTemplate>
      {isValidString(username) && isFetched && (
        <>
          <ProfileFollowListHeader />
          <ProfileFollowListBody username={username} />
        </>
      )}
    </AppBaseTemplate>
  );
};

export default ProfileFollowListPage;
