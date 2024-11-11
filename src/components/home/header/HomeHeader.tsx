import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/logo/FeelogLogo62x30.svg';
import { ReactComponent as SearchButtonIcon } from 'assets/images/icon/svg/SearchButtonIcon.svg';
import TabStickBar from 'components/common/container/TabStickBar';
import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import HeaderLayout from 'components/layouts/HeaderLayout';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { ACTIVE_CLASS_NAME } from '../../../const/ClassNameConst';
import { SEARCH_PATH } from '../../../const/PathConst';
import {
  FOLLOW_FOR_ME_TAB_ID,
  FOLLOW_FOR_ME_TAB_NAME,
  TASTE_FOR_ME_TAB_ID,
  TASTE_FOR_ME_TAB_NAME,
} from '../../../const/TabConfigConst';
import {
  FOLLOW_STATE_SESSION_VALUE,
  POPULARITY_STATE_SESSION_VALUE,
} from '../../../const/UserSettingConst';
import { HomeHistoryInterface } from '../../../global/interface/localstorage/HomeHistoryInterface';
import {
  getHomeHistory,
  saveMainTabIdByHomeHistory,
} from '../../../global/util/HomeUtil';
import { setCurrentIntertestByUserSettingInfo } from '../../../global/util/UserSettingUtil';
import { scrollPositionAtomByFollowForMe } from '../../../states/FollowForMeAtom';
import { homeTabIdAtom } from '../../../states/HomePageAtom';
import { scrollPositionAtomByTasteForMe } from '../../../states/TasteForMeAtom';

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mainTabId, setMainTabId] = useRecoilState(homeTabIdAtom);
  const [scrollPositionByFollow, setScrollPositionByFollow] = useRecoilState(
    scrollPositionAtomByFollowForMe,
  );
  const [scrollPositionByTaste, setScrollPositionByTaste] = useRecoilState(
    scrollPositionAtomByTasteForMe,
  );

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

  useEffect(() => {
    const homeHistory: HomeHistoryInterface = getHomeHistory();
    setMainTabId(homeHistory.mainTabId);

    if (homeHistory.mainTabId === TASTE_FOR_ME_TAB_ID) {
      setCurrentIntertestByUserSettingInfo(POPULARITY_STATE_SESSION_VALUE);
    } else {
      setCurrentIntertestByUserSettingInfo(FOLLOW_STATE_SESSION_VALUE);
    }
  }, []);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  return (
    <>
      <HeaderLayout
        HeaderLayoutStyle={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.97)',
        }}
      >
        <HomeHeaderContainer>
          <AppLogoWrap>
            <FeelogLogo />
          </AppLogoWrap>
          <HomeTabContainer>
            {mainTabList.map((v, i) => (
              <TabItem
                key={i}
                className={mainTabId === v.tabId ? ACTIVE_CLASS_NAME : ''}
                onClick={() => {
                  if (v.tabId === TASTE_FOR_ME_TAB_ID) {
                    setScrollPositionByFollow(window.scrollY);

                    setCurrentIntertestByUserSettingInfo(
                      POPULARITY_STATE_SESSION_VALUE,
                    );

                    setTimeout(() => {
                      window.scrollTo({ top: scrollPositionByTaste });
                    }, 0);
                  } else {
                    setScrollPositionByTaste(window.scrollY);

                    setCurrentIntertestByUserSettingInfo(
                      FOLLOW_STATE_SESSION_VALUE,
                    );
                    setTimeout(() => {
                      window.scrollTo({ top: scrollPositionByFollow });
                    }, 0);
                  }
                  saveMainTabIdByHomeHistory(v.tabId);
                  setMainTabId(v.tabId);
                }}
              >
                {v.tabName}
                {mainTabId === v.tabId && <TabStickBar />}
              </TabItem>
            ))}
          </HomeTabContainer>
          <SubTabContainer onClick={() => navigate(SEARCH_PATH)}>
            {/* @REFEC: 나중에 추가 될 기능 */}
            {/* <FilterTab>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 6C12 6.53043 12.2107 7.03914 12.5858 7.41421C12.9609 7.78929 13.4696 8 14 8C14.5304 8 15.0391 7.78929 15.4142 7.41421C15.7893 7.03914 16 6.53043 16 6M12 6C12 5.46957 12.2107 4.96086 12.5858 4.58579C12.9609 4.21071 13.4696 4 14 4C14.5304 4 15.0391 4.21071 15.4142 4.58579C15.7893 4.96086 16 5.46957 16 6M12 6H4M16 6H20M6 12C6 12.5304 6.21071 13.0391 6.58579 13.4142C6.96086 13.7893 7.46957 14 8 14C8.53043 14 9.03914 13.7893 9.41421 13.4142C9.78929 13.0391 10 12.5304 10 12M6 12C6 11.4696 6.21071 10.9609 6.58579 10.5858C6.96086 10.2107 7.46957 10 8 10C8.53043 10 9.03914 10.2107 9.41421 10.5858C9.78929 10.9609 10 11.4696 10 12M6 12H4M10 12H20M15 18C15 18.5304 15.2107 19.0391 15.5858 19.4142C15.9609 19.7893 16.4696 20 17 20C17.5304 20 18.0391 19.7893 18.4142 19.4142C18.7893 19.0391 19 18.5304 19 18M15 18C15 17.4696 15.2107 16.9609 15.5858 16.5858C15.9609 16.2107 16.4696 16 17 16C17.5304 16 18.0391 16.2107 18.4142 16.5858C18.7893 16.9609 19 17.4696 19 18M15 18H4M19 18H20"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </FilterTab> */}

            <SearchButtonIcon />
          </SubTabContainer>
        </HomeHeaderContainer>
      </HeaderLayout>
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const HomeHeaderContainer = styled.div`
  z-index: 5;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
`;

const HomeTabContainer = styled.div`
  display: flex;
  gap: 20px;
  position: fixed;
  z-index: 1;
  left: 50%;
  transform: translate(-50%, 50%);
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
const SubTabContainer = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: flex;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }
  margin: auto 0px;
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

export default HomeHeader;
