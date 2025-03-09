import NotificationTabButton from 'components/notification/NotificationTabButton';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React from 'react';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileAccountBody from '../components/profile/profileaccount/ProfileAccountBody';
import ProfileAccountHeader from '../components/profile/profileaccount/ProfileAccountHeader';

const MyProfileAccountPage: React.FC = () => {
  const { data } = QueryStateMyProfileInfo();

  return (
    <>
      <PageHelmentInfoElement
        title={`${data?.username}`}
        ogTitle={`프로필: ${data?.username}`}
        ogImage={data?.profilePath}
        ogUrl={window.location.href}
        ogDescription={`프로필: ${data?.username}`}
      />
      <AppBaseTemplate>
        {data && (
          <>
            <ProfileAccountHeader
              username={data.username}
              isPrevButton={false}
              prevButton={<NotificationTabButton />}
            />
            <ProfileAccountBody username={data.username} />
          </>
        )}
        <BottomNavBar />
      </AppBaseTemplate>
    </>
  );
};

export default MyProfileAccountPage;
