import React from 'react';

import styled from 'styled-components';
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

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export default HomePage;
