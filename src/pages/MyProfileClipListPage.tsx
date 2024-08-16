import React from 'react';
import BodyFixScrollElement from '../components/BodyFixScrollElement';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileClipListBody from '../components/profile/ProfileClipListBody';
import ProfileClipScrapHeader from '../components/profile/ProfileClipScrapHeader';
const MyProfileClipPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <BodyFixScrollElement />
      <ProfileClipScrapHeader />
      <ProfileClipListBody />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default MyProfileClipPage;
