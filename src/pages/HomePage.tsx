import React from 'react';

import BottomNavBar from 'components/BottomNavBar';
import HomeBody from 'components/home/HomeBody';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { FEED_TAB_NAME } from 'const/TabConst';
import HomeHeader from '../components/home/header/HomeHeader';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const HomePage: React.FC = () => {
  return (
    <>
      <PageHelmentInfoElement
        title={FEED_TAB_NAME}
        ogTitle={FEED_TAB_NAME}
        ogUrl={window.location.href}
        ogDescription={`${APP_SERVICE_NAME} 서비스: ${FEED_TAB_NAME}}`}
      />
      <AppBaseTemplate>
        <HomeHeader />

        <HomeBody />

        <BottomNavBar />
      </AppBaseTemplate>
    </>
  );
};

export default HomePage;
