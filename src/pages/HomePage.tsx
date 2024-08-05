import React from 'react';

import TabBar from '../components/BottomNavBar';
import HomeBody from '../components/home/body/HomeBody';
import HomeHeader from '../components/home/header/HomeHeader';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const HomePage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <HomeHeader />
      {/* refer: 수정 */}
      {/* <PostContainer>
          <PostComponent />
          <PostComponent />
        </PostContainer> */}
      <HomeBody />
      <TabBar />
    </AppBaseTemplate>
  );
};

export default HomePage;
