import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import ProfileFollowListBody from 'components/profile/followlist/ProfileFollowListBody';
import ProfileFollowListHeader from 'components/profile/followlist/ProfileFollowListHeader';
import React from 'react';

const ProfileFollowListPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <ProfileFollowListHeader />
      <ProfileFollowListBody />
    </AppBaseTemplate>
  );
};

export default ProfileFollowListPage;
