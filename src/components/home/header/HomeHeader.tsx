import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/logo/FeelogLogo62x30.svg';
import { ReactComponent as SearchButtonIcon } from 'assets/images/icon/svg/SearchButtonIcon.svg';
import TabStickBar from 'components/common/container/TabStickBar';
import HeaderLayout from 'components/layouts/HeaderLayout';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React, { useEffect } from 'react';
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
import { HomeHistoryInterface } from '../../../global/interface/localstorage/HomeHistoryInterface';
import {
  getHomeHistory,
  saveMainTabIdByHomeHistory,
} from '../../../global/util/HomeUtil';
import { homeTabIdAtom } from '../../../states/HomePageAtom';

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mainTabId, setMainTabId] = useRecoilState(homeTabIdAtom);

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
  }, []);

  return (
    <>
      <HeaderLayout
        HeaderLayoutStyle={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
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
            <SearchButtonIcon />
          </SubTabContainer>
        </HomeHeaderContainer>
      </HeaderLayout>
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
  cursor: pointer;
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
