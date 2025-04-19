import NotificationTabButton from 'components/notification/NotificationTabButton';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { initPageInfoAtom } from 'states/SystemConfigAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileAccountBody from '../components/profile/profileaccount/ProfileAccountBodyByPage';
import ProfileAccountHeader from '../components/profile/profileaccount/ProfileAccountHeader';

const MyProfileAccountPage: React.FC = () => {
  const { data, isFetched } = QueryStateMyProfileInfo();

  const [initPageInfo, setInitPageInfo] = useRecoilState(initPageInfoAtom);
  useEffect(() => {
    if (!isFetched) return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        setInitPageInfo((prev) => ({ ...prev, isMyProfilePage: true }));
      }, 200);
    });
  }, [isFetched]);

  const { windowWidth } = useWindowSize();

  return (
    <>
      <PageHelmentInfoElement
        title={`${data?.username}`}
        ogTitle={`프로필: ${data?.username}`}
        ogImage={data?.profilePath}
        ogUrl={window.location.href}
        ogDescription={`프로필: ${data?.username}`}
      />
      <div
        style={{
          opacity: initPageInfo.isMyProfilePage ? 1 : 0,
          transition: `opacity 0.3s ease-in`,
        }}
      >
        <AppBaseTemplate>
          <>
            <ProfileAccountHeader
              username={data?.username || ''}
              isPrevButton={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM}
              prevButton={
                windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM ? (
                  <NotificationTabButton />
                ) : (
                  <></>
                )
              }
            />
            <ProfileAccountBody username={data?.username || ''} />
          </>
        </AppBaseTemplate>
      </div>
      <BottomNavBar />
    </>
  );
};

export default MyProfileAccountPage;
