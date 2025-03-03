import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import React from 'react';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileMakeScrapBody from '../components/profile/ProfileMakeScrapBody';
import ProfileMakeScrapHeader from '../components/profile/ProfileMakeScrapHeader';
const MakeScrapPage: React.FC = () => {
  useBodyAdaptProps([
    { key: 'overscroll-behavior', value: 'none' },
    { key: 'overflow', value: 'hidden' },
  ]);
  return (
    <AppBaseTemplate isAppInsetTopMargin={false}>
      {/* <BodyFixScrollElement /> */}
      <ProfileMakeScrapHeader />
      <ProfileMakeScrapBody />
    </AppBaseTemplate>
  );
};

export default MakeScrapPage;
