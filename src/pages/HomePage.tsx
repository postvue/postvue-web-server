import React, { useEffect } from 'react';

import BottomNavBar from 'components/BottomNavBar';
import HomeBody from 'components/home/HomeBody';
import useWindowScrollY from 'hook/customhook/useWindowScrollY';
import { useLocation } from 'react-router-dom';
import HomeHeader from '../components/home/header/HomeHeader';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const HomePage: React.FC = () => {
  const location = useLocation();
  const { scrollInfos, scrollRemove } = useWindowScrollY({
    path: location.pathname,
  });

  // 스크롤 위치 저장 및 복원
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scrollInfos });
      scrollRemove();
    }, 30);
  }, [location.pathname]);

  return (
    <AppBaseTemplate>
      <HomeHeader />
      {/* <PullToRefresh
        onRefresh={() => window.location.reload()}
        maxDistance={100}
        loadingComponent={<div>테스트</div>}
      > */}
      {/* refer: 수정 */}
      {/* <PostContainer>
          <PostComponent />
          <PostComponent />
        </PostContainer> */}
      <HomeBody />
      {/* </PullToRefresh> */}
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default HomePage;
