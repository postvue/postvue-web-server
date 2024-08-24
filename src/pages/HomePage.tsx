import React from 'react';

import BottomNavBar from '../components/BottomNavBar';
import HomeBody from '../components/home/HomeBody';
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
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default HomePage;
