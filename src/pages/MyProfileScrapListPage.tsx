import React from 'react';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileClipScrapHeader from '../components/profile/ProfileClipScrapHeader';
import ProfileScrapListBody from '../components/profile/ProfileScrapListBody';
const MyProfileScrapListPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <ProfileClipScrapHeader />
      <ProfileScrapListBody />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default MyProfileScrapListPage;
