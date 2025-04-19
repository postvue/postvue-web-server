import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

import { homeTabInfoAtom } from '../../states/HomePageAtom';

import ViewPagerLayout from 'components/layouts/ViewPagerLayout';
import {
  FOLLOW_FOR_ME_TAB_ID,
  TASTE_FOR_ME_TAB_ID,
} from 'const/TabConfigConst';
import { isApp } from 'global/util/reactnative/nativeRouter';
import 'swiper/css';
import HomeFolowBody from './HomeFollowBody';
import HomeTasteBody from './HomeTasteBody';

const HomeBody: React.FC = () => {
  const [mainTabInfo, setMainTabInfo] = useRecoilState(homeTabInfoAtom);

  useEffect(() => {
    if (!mainTabInfo.scrollInfo.isActive) return;
    setMainTabInfo((prev) => ({
      ...prev,
      scrollInfo: { isActive: false, scroll: 0 },
    }));
  }, [mainTabInfo.scrollInfo.isActive]);

  const slideRefs = useRef<HTMLDivElement[]>([]);
  return (
    <>
      {isApp() ? (
        <ViewPagerLayout
          index={mainTabInfo.activeTabId}
          actionSilde={(index) => {
            setMainTabInfo((prev) => ({
              ...prev,
              activeTabId: index,
            }));
          }}
          externalRefs={slideRefs}
          scrollToInfo={
            mainTabInfo.scrollInfo.isActive
              ? {
                  tabId: mainTabInfo.activeTabId,
                  scrollTo: mainTabInfo.scrollInfo.scroll,
                }
              : undefined
          }
          childrenList={[
            <HomeTasteBody
              key={TASTE_FOR_ME_TAB_ID}
              scrollElement={slideRefs.current[0]}
            />,
            <HomeFolowBody
              key={FOLLOW_FOR_ME_TAB_ID}
              scrollElement={slideRefs.current[1]}
            />,
          ]}
        />
      ) : (
        <>
          {mainTabInfo.activeTabId === TASTE_FOR_ME_TAB_ID ? (
            <HomeTasteBody />
          ) : (
            <HomeFolowBody />
          )}
        </>
      )}
    </>
  );
};

export default HomeBody;
