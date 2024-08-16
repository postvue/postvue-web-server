import React from 'react';
import BodyFixScrollElement from '../components/BodyFixScrollElement';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileClipScrapHeader from '../components/profile/ProfileClipScrapHeader';
import ProfileScrapListBody from '../components/profile/ProfileScrapListBody';
const MyProfileScrapListPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <BodyFixScrollElement />
      <ProfileClipScrapHeader />
      <ProfileScrapListBody />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default MyProfileScrapListPage;
