import ViewPagerLayout from 'components/layouts/ViewPagerLayout';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import ProfileClipListBody from 'components/profile/ProfileClipListBody';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import {
  PROFILE_CLIP_TAB_ID,
  PROFILE_SCRAP_TAB_ID,
} from 'const/TabConfigConst';
import { SCRAP_TAB_NAME } from 'const/TabConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { scrapTabInfoAtom } from 'states/ProfileAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ProfileClipScrapHeader from '../components/profile/ProfileClipScrapHeader';
import ProfileScrapListBody from '../components/profile/ProfileScrapListBody';
const MyProfileScrapListPage: React.FC = () => {
  const [scrapTabInfo, setScrapTabInfo] = useRecoilState(scrapTabInfoAtom);

  useEffect(() => {
    if (!scrapTabInfo.scrollInfo.isActive) return;

    setScrapTabInfo((prev) => ({
      ...prev,
      scrollInfo: { isActive: false, scroll: 0 },
    }));
  }, [scrapTabInfo.scrollInfo.isActive]);

  return (
    <>
      <PageHelmentInfoElement
        title={SCRAP_TAB_NAME}
        ogTitle={SCRAP_TAB_NAME}
        ogUrl={window.location.href}
        ogDescription={`${APP_SERVICE_NAME} 서비스: ${SCRAP_TAB_NAME}}`}
      />
      <AppBaseTemplate>
        <ProfileClipScrapHeader />

        {isApp() ? (
          <ViewPagerLayout
            index={scrapTabInfo.activeTabId}
            actionSilde={(index) => {
              setScrapTabInfo((prev) => ({ ...prev, activeTabId: index }));
            }}
            scrollToInfo={
              scrapTabInfo.scrollInfo.isActive
                ? {
                    tabId: scrapTabInfo.activeTabId,
                    scrollTo: scrapTabInfo.scrollInfo.scroll,
                  }
                : undefined
            }
            childrenList={[
              <ProfileClipListBody key={PROFILE_CLIP_TAB_ID} />,
              <ProfileScrapListBody key={PROFILE_SCRAP_TAB_ID} />,
            ]}
          />
        ) : (
          <>
            {scrapTabInfo.activeTabId === PROFILE_CLIP_TAB_ID ? (
              <ProfileClipListBody />
            ) : (
              <ProfileScrapListBody />
            )}
          </>
        )}

        <BottomNavBar />
      </AppBaseTemplate>
    </>
  );
};

export default MyProfileScrapListPage;
