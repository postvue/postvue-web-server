import React from 'react';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileAccountBody from '../components/profile/ProfileAccountBody';
import ProfileAccountHeader from '../components/profile/ProfileAccountHeader';

const ProfileAccountPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <ProfileAccountHeader />
      <ProfileAccountBody />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default ProfileAccountPage;
