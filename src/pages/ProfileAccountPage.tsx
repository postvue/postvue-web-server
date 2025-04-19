import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { initPageInfoAtom } from 'states/SystemConfigAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileAccountBody from '../components/profile/profileaccount/ProfileAccountBodyByPage';
import ProfileAccountHeader from '../components/profile/profileaccount/ProfileAccountHeader';

const ProfileAccountPage: React.FC = () => {
  const param = useParams();
  const username = param.username || '';

  const [initPageInfo, setInitPageInfo] = useRecoilState(initPageInfoAtom);
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        setInitPageInfo((prev) => ({ ...prev, isMyProfilePage: true }));
      }, 200);
    });
  }, []);

  return (
    <>
      <PageHelmentInfoElement
        title={`${username}`}
        ogTitle={`프로필: ${username}`}
        ogUrl={window.location.href}
        ogDescription={`프로필: ${username}`}
      />
      <div
        style={{
          opacity: initPageInfo.isMyProfilePage ? 1 : 0,
          transition: `opacity 0.3s ease-in`,
        }}
      >
        <AppBaseTemplate>
          {username && (
            <>
              <ProfileAccountHeader username={username} />
              <ProfileAccountBody username={username} />
            </>
          )}
        </AppBaseTemplate>
      </div>
      <BottomNavBar />
    </>
  );
};

export default ProfileAccountPage;
