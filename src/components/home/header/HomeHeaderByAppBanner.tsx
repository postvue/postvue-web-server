import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/logo/FeelogLogo.svg';
import AppBanner from 'components/common/AppBanner';
import TabStickBar from 'components/common/container/TabStickBar';
import HeaderLayout from 'components/layouts/HeaderLayout';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React from 'react';
import { useRecoilState } from 'recoil';
import { homeTabInfoAtom } from 'states/HomePageAtom';
import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../../const/ClassNameConst';
import {
  FOLLOW_FOR_ME_TAB_ID,
  FOLLOW_FOR_ME_TAB_NAME,
  TASTE_FOR_ME_TAB_ID,
  TASTE_FOR_ME_TAB_NAME,
} from '../../../const/TabConfigConst';
import SearchTabComponent from './SearchTabComponent';

const HomeHeaderByAppBanner: React.FC = () => {
  const [mainTabInfo, setMainTabInfo] = useRecoilState(homeTabInfoAtom);

  const mainTabList = [
    {
      tabId: TASTE_FOR_ME_TAB_ID,
      tabName: TASTE_FOR_ME_TAB_NAME,
    },
    {
      tabId: FOLLOW_FOR_ME_TAB_ID,
      tabName: FOLLOW_FOR_ME_TAB_NAME,
    },
  ];

  // useEffect(() => {
  // const homeHistory: HomeHistoryInterface = getHomeHistory();

  // setMainTabInfo({
  //   activeTabId: homeHistory.mainTabId,
  //   scrollInfo: {
  //     isActive: false,
  //     scroll: 0,
  //   },
  // });
  // }, []);

  return (
    <>
      {/* <HomeHeaderContainerWrap> */}
      <AppBanner />
      <HeaderLayout
        HeaderLayoutStyle={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          position: 'sticky',
          top: '0',
        }}
      >
        <HomeHeaderContainer>
          <AppLogoWrap>
            {/* <FeelogLogo /> */}
            <FeelogLogo />
          </AppLogoWrap>

          <HomeTabContainer>
            {mainTabList.map((v, i) => (
              <TabItem
                key={i}
                className={
                  mainTabInfo.activeTabId === v.tabId ? ACTIVE_CLASS_NAME : ''
                }
                onClick={() => {
                  // saveMainTabIdByHomeHistory(v.tabId);

                  setMainTabInfo({
                    activeTabId: v.tabId,
                    scrollInfo: {
                      isActive: false,
                      scroll: 0,
                    },
                  });
                }}
              >
                {v.tabName}

                {mainTabInfo.activeTabId === v.tabId && <TabStickBar />}
              </TabItem>
            ))}
          </HomeTabContainer>
          <SearchTabComponent />
        </HomeHeaderContainer>
      </HeaderLayout>
      {/* </HomeHeaderContainerWrap> */}
    </>
  );
};

// const HomeHeaderContainerWrap = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: fixed;
//   width: 100%;
//   top: 0;
//   z-index: 100;
//   max-width: ${theme.systemSize.appDisplaySize.maxWidth};
// `;

const HomeHeaderContainer = styled.div`
  z-index: 5;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  position: relative;
`;

const HomeTabContainer = styled.div`
  display: flex;
  gap: 20px;
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const TabItem = styled.div`
  color: ${({ theme }) => theme.grey.Grey4};
  cursor: pointer;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    font: ${({ theme }) => theme.fontSizes.Subhead3};
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    font: ${({ theme }) => theme.fontSizes.Headline1};
  }

  &.active {
    color: black;
  }
`;

const AppLogoWrap = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: flex;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }
  margin: auto 0px;
`;

export default HomeHeaderByAppBanner;
