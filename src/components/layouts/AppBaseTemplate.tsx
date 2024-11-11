import SideNavBar from 'components/SideNavBar';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import SearchBody from 'components/search/body/SearchBody';
import SearchSuggestBody from 'components/search/body/SearchSuggestBody';
import SearchHeader from 'components/search/header/SearchHeader';
import { HOME_PATH, PROFILE_SETTING_PATH, SEARCH_PATH } from 'const/PathConst';
import {
  MEDIA_MIDDLE_1300_WIDTH,
  MEDIA_MIDDLE_1400_WIDTH,
  MEDIA_MIDDLE_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isSearchInputActiveAtom } from 'states/SearchPostAtom';
import { borderShadowStyle_prop } from 'styles/commonStyles';
import theme from 'styles/theme';

interface AppBaseTemplate {
  children: ReactNode;
  slideBarNode?: ReactNode;
  SlideBarNodeStyle?: React.CSSProperties;
  hasSearchInputModule?: boolean;
  hasSearchBodyModule?: boolean;
  SideContainerStyle?: React.CSSProperties;
  SideBarNodeWrapStyle?: React.CSSProperties;
  AppContainerStyle?: React.CSSProperties;
  isTransparentSearchButton?: boolean;
}

const AppBaseTemplate: React.FC<AppBaseTemplate> = ({
  children,
  slideBarNode,
  hasSearchInputModule = true,
  hasSearchBodyModule = true,
  SideContainerStyle,
  SlideBarNodeStyle,
  SideBarNodeWrapStyle,
  AppContainerStyle,
  isTransparentSearchButton = false,
}) => {
  const isSearchInputActive = useRecoilValue(isSearchInputActiveAtom);

  const location = useLocation();

  // '/search' 경로로 시작하는 경우 모듈을 숨기고 싶다면
  const isSearchBodyPage = location.pathname.startsWith(`${SEARCH_PATH}/`);

  const isNotActiveSearchBody =
    [SEARCH_PATH].includes(location.pathname) ||
    location.pathname.startsWith(PROFILE_SETTING_PATH);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      <Container>
        {/* refer: 수정 */}
        {windowSize.width > MEDIA_MOBILE_MAX_WIDTH_NUM && (
          <Header>
            <HeaderWrap>
              <SideNavBar />
            </HeaderWrap>
            {/* <HeaderContainer>
              
            </HeaderContainer> */}
          </Header>
        )}

        <Main id="main">
          <MainContainer>
            <MainWrap>
              <AppContainer style={AppContainerStyle}>{children}</AppContainer>
              {/* refer: 수정 */}
              {windowSize.width > MEDIA_MOBILE_MAX_WIDTH_NUM && (
                <SideBar style={SideContainerStyle}>
                  {hasSearchInputModule && (
                    <>
                      <SearchHeader
                        backToUrl={HOME_PATH}
                        SearchHeaderContainer={{
                          width: `${SIDE_WIDTH}px`,
                          backgroundColor: isTransparentSearchButton
                            ? 'transparent'
                            : '',
                          paddingTop: '10px',
                          position: 'fixed',
                        }}
                        isPrevButton={false}
                      />
                      {isSearchInputActive && (
                        <SearchSuggestBodyWrap>
                          <SearchSuggestBody
                            SearchSuggestBodyContiainerStyle={{
                              width: `${SIDE_WIDTH}px`,
                            }}
                          />
                        </SearchSuggestBodyWrap>
                      )}
                    </>
                  )}

                  {hasSearchBodyModule && !isNotActiveSearchBody && (
                    <SearchBodyWrap $isSearchPage={isSearchBodyPage}>
                      <SearchBody />
                    </SearchBodyWrap>
                  )}
                  {slideBarNode && (
                    <RightSidebarWrapWrap style={SlideBarNodeStyle}>
                      <SideBarNodeWrap style={SideBarNodeWrapStyle}>
                        {slideBarNode}
                      </SideBarNodeWrap>
                    </RightSidebarWrapWrap>
                  )}
                </SideBar>
              )}
            </MainWrap>
          </MainContainer>
        </Main>
      </Container>
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const CONTAINER_GAP = 70;
const CONTAINER_MIN_GAP = 30;

const HEADER_WIDTH = 400;

const SIDE_WIDTH = 400;

const RightSideHeaderMargin = 8;

const Container = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;

  @media (max-width: ${MEDIA_MIDDLE_WIDTH}) {
    gap: ${CONTAINER_MIN_GAP}px;
  }

  @media (min-width: ${MEDIA_MIDDLE_WIDTH}) {
    gap: ${CONTAINER_GAP}px;
  }
`;
const Header = styled.header`
  height: 100vh;
  width: 100%;
  display: flex;

  @media ((min-width: ${MEDIA_MOBILE_MAX_WIDTH}) and (max-width: ${MEDIA_MIDDLE_1400_WIDTH})) {
    padding-left: 50px;
    width: 150px;
  }
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 150px;
  }

  @media (min-width: ${MEDIA_MIDDLE_1400_WIDTH}) {
    justify-content: center;
    min-width: ${HEADER_WIDTH - 100}px;
    max-width: ${HEADER_WIDTH - 100}px;
  }
`;

const HeaderContainer = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`;

const HeaderWrap = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  position: fixed;
`;

const SideBar = styled.div`
  position: relative;

  max-width: ${SIDE_WIDTH}px;
  min-width: ${SIDE_WIDTH}px;

  @media (max-width: ${MEDIA_MIDDLE_1300_WIDTH}) {
    padding-right: 10px;
  }
`;

const SearchSuggestBodyWrap = styled.div``;

const Main = styled.main`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 100%;
  }
`;

const MainContainer = styled.div``;

const MainWrap = styled.div`
  display: flex;

  @media ((min-width: ${MEDIA_MOBILE_MAX_WIDTH}) and (max-width: ${MEDIA_MIDDLE_WIDTH})) {
    gap: ${CONTAINER_MIN_GAP}px;
  }

  @media (min-width: ${MEDIA_MIDDLE_WIDTH}) {
    gap: ${CONTAINER_GAP}px;
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    margin: auto;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  position: relative;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    margin: auto;
    // margin-bottom: 86px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
    min-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
    margin-bottom: 8px;
  }
`;

const SearchBodyWrap = styled.div<{ $isSearchPage: boolean }>`
  width: 100%;
  position: sticky;

  padding-top: ${(props) =>
    props.$isSearchPage ? '0px' : `${theme.systemSize.header.height}`};
  top: ${(props) => (props.$isSearchPage ? `-160px` : '-180px')};
`;

const SideBarNodeWrap = styled.div`
  width: 100%;
  position: relative;
  height: calc(100vh - ${RightSideHeaderMargin * 2}px);
`;

const RightSidebarWrapWrap = styled.div`
  margin-top: ${RightSideHeaderMargin}px;
  max-width: ${SIDE_WIDTH}px;
  min-width: ${SIDE_WIDTH}px;
  position: fixed;

  border-radius: 20px;
  box-shadow: ${borderShadowStyle_prop};
`;

export default AppBaseTemplate;
