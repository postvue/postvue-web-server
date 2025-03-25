import React from 'react';

import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';

import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { fetchProfilePostListByNotChannel } from 'global/util/channel/static/fetchProfilePostListByNotChannel';
import useWindowSize from 'hook/customhook/useWindowSize';
import ProfileAccountBodyLayout from './ProfileAccountBodyLayout';

interface ProfileAccountBodyProps {
  username: string;
}

const ProfileAccountBody: React.FC<ProfileAccountBodyProps> = ({
  username,
}) => {
  const { isFetched: isFetchedByProfileInfo, refetch: refetchByProfileInfo } =
    QueryStateProfileInfo(username);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <>
          {isFetchedByProfileInfo && (
            <PullToRefreshComponent
              onRefresh={async () => {
                refetchByProfileInfo();

                fetchProfilePostListByNotChannel(username);
              }}
            >
              <ProfileAccountBodyLayout username={username} />
            </PullToRefreshComponent>
          )}
        </>
      ) : (
        <ProfileAccountBodyLayout username={username} />
      )}
    </>
  );
};

export default ProfileAccountBody;
