import React from 'react';
import styled from 'styled-components';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileScrapBody from '../components/profile/ProfileScrapBody';
import ProfileScrapHeader from '../components/profile/ProfileScrapHeader';
const MyProfileScrap: React.FC = () => {
  return (
    <AppBaseTemplate>
      <ProfileScrapContainer>
        <ProfileScrapHeader />
        <ProfileScrapBody />
        <BottomNavBar />
      </ProfileScrapContainer>
    </AppBaseTemplate>
  );
};

const ProfileScrapContainer = styled.div``;

export default MyProfileScrap;
