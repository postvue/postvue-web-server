import React from 'react';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileClipListBody from '../components/profile/ProfileClipListBody';
import ProfileClipScrapHeader from '../components/profile/ProfileClipScrapHeader';
const MyProfileClipPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <ProfileClipScrapHeader />
      <ProfileClipListBody />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default MyProfileClipPage;
