import { QueryStateProfileClipListInfinite } from 'hook/queryhook/QueryStateProfileClipListInfinite';
import React from 'react';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileClipListBody from '../components/profile/ProfileClipListBody';
import ProfileClipScrapHeader from '../components/profile/ProfileClipScrapHeader';
const MyProfileClipPage: React.FC = () => {
  const { isFetched: isFetchedByProfileClipList } =
    QueryStateProfileClipListInfinite();

  return (
    <AppBaseTemplate>
      <ProfileClipScrapHeader />
      {isFetchedByProfileClipList && (
        <>
          <ProfileClipListBody />
        </>
      )}
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default MyProfileClipPage;
