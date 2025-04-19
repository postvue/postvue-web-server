import ViewPagerLayout from 'components/layouts/ViewPagerLayout';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import ProfileClipListBody from 'components/profile/ProfileClipListBody';
import ProfileMakeScrapFloatingButton from 'components/profile/ProfileMakeScrapFloatingButton';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import {
  PROFILE_CLIP_TAB_ID,
  PROFILE_SCRAP_TAB_ID,
} from 'const/TabConfigConst';
import { SCRAP_TAB_NAME } from 'const/TabConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateProfileScrapList } from 'hook/queryhook/QueryStateProfileScrapList';
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

  const { data: profileScrapList, isFetched: isFetchedByProfileScrapList } =
    QueryStateProfileScrapList();

  const { windowWidth } = useWindowSize();
  return (
    <>
      <PageHelmentInfoElement
        title={SCRAP_TAB_NAME}
        ogTitle={SCRAP_TAB_NAME}
        ogUrl={window.location.href}
        ogDescription={`${APP_SERVICE_NAME} 서비스: ${SCRAP_TAB_NAME}}`}
      />
      <AppBaseTemplate
        AppBaseStlye={{ position: 'relative' }}
        AppBottomNode={
          windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM && (
            <ProfileMakeScrapFloatingButton
              isShow={
                (isFetchedByProfileScrapList &&
                  scrapTabInfo.activeTabId === PROFILE_SCRAP_TAB_ID &&
                  profileScrapList &&
                  profileScrapList?.pages.flatMap((v) => v).length > 0) ||
                false
              }
              FloatingActionButtonLayoutStyle={{ position: 'absolute' }}
            />
          )
        }
      >
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
