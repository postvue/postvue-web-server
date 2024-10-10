import React from 'react';

import ProfilePostDetailPopup from 'components/popups/ProfilePostDeatilPopup';
import { useRecoilState } from 'recoil';
import { isPostDetailInfoPopupAtom } from 'states/PostAtom';
import BottomNavBar from '../components/BottomNavBar';
import HomeBody from '../components/home/HomeBody';
import HomeHeader from '../components/home/header/HomeHeader';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const HomePage: React.FC = () => {
  const [isPostDetailInfoPopup, setIsPostDetailInfoPopup] = useRecoilState(
    isPostDetailInfoPopupAtom,
  );

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
      {isPostDetailInfoPopup && <ProfilePostDetailPopup />}
    </AppBaseTemplate>
  );
};

export default HomePage;
