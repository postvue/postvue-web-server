import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import React from 'react';
import { useParams } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileAccountBody from '../components/profile/profileaccount/ProfileAccountBody';
import ProfileAccountHeader from '../components/profile/profileaccount/ProfileAccountHeader';

const ProfileAccountPage: React.FC = () => {
  const param = useParams();
  const username = param.username || '';

  return (
    <>
      <PageHelmentInfoElement
        title={`${username}`}
        ogTitle={`프로필: ${username}`}
        ogUrl={window.location.href}
        ogDescription={`프로필: ${username}`}
      />
      <AppBaseTemplate>
        {username && (
          <>
            <ProfileAccountHeader username={username} />
            <ProfileAccountBody username={username} />
          </>
        )}
        <BottomNavBar />
      </AppBaseTemplate>
    </>
  );
};

export default ProfileAccountPage;
