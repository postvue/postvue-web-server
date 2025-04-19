import React, { useEffect } from 'react';

import BottomNavBar from 'components/BottomNavBar';
import HomeHeaderByAppBanner from 'components/home/header/HomeHeaderByAppBanner';
import HomeBody from 'components/home/HomeBody';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { FEED_TAB_NAME } from 'const/TabConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import useObjectScrollY from 'hook/customhook/useWindowScrollY';
import { useRecoilState } from 'recoil';
import { initPageInfoAtom } from 'states/SystemConfigAtom';
import HomeHeader from '../components/home/header/HomeHeader';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const HomePage: React.FC = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /iphone/.test(ua);

  const { scrollInfos, scrollRemove } = useObjectScrollY({
    path: location.pathname,
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(
        () => {
          window.scrollTo({ top: scrollInfos });

          scrollRemove();
        },
        15 * Math.floor(Math.log(scrollInfos)),
      );
    });
  }, [location.pathname]);

  const [initPageInfo, setInitPageInfo] = useRecoilState(initPageInfoAtom);
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        setInitPageInfo((prev) => ({ ...prev, isHomePage: true }));
      }, 100);
    });
  }, []);

  return (
    <>
      <PageHelmentInfoElement
        title={FEED_TAB_NAME}
        ogTitle={FEED_TAB_NAME}
        ogUrl={window.location.href}
        ogDescription={`${APP_SERVICE_NAME} 서비스: ${FEED_TAB_NAME}}`}
      />
      <div
        style={{
          opacity: initPageInfo.isHomePage ? 1 : 0,
          transition: `opacity 0.3s ease-in`,
        }}
      >
        <AppBaseTemplate
          appContainerTopMargin={isApp() || !isMobile ? undefined : `0px`}
          isScrollByAppContainer={false}
          isScrollSave={false}
        >
          {isApp() || !isMobile ? <HomeHeader /> : <HomeHeaderByAppBanner />}

          <HomeBody />
        </AppBaseTemplate>
      </div>
      <BottomNavBar />
    </>
  );
};

export default HomePage;
