import React from 'react';
import BodyFixScrollElement from '../components/BodyFixScrollElement';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileMakeScrapBody from '../components/profile/ProfileMakeScrapBody';
import ProfileMakeScrapHeader from '../components/profile/ProfileMakeScrapHeader';
const MakeScrapPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <BodyFixScrollElement />
      <ProfileMakeScrapHeader />
      <ProfileMakeScrapBody />
    </AppBaseTemplate>
  );
};

export default MakeScrapPage;
