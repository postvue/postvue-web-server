import SideNavBar from 'components/SideNavBar';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/pc/FeelogLogo.svg';
import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import SearchBody from 'components/search/body/SearchBody';
import SearchSuggestBody from 'components/search/body/SearchSuggestBody';
import SearchHeader from 'components/search/header/SearchHeader';
import { HOME_PATH, PROFILE_SETTING_PATH, SEARCH_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isSearchInputActiveAtom } from 'states/SearchPostAtom';
import theme from 'styles/theme';

interface AppBaseTemplate {
  children: ReactNode;
}

const AppBaseTemplate: React.FC<AppBaseTemplate> = ({ children }) => {
  const navigate = useNavigate();

  const isSearchInputActive = useRecoilValue(isSearchInputActiveAtom);

  const param = useParams();

  const location = useLocation();

  // '/search' 경로로 시작하는 경우 모듈을 숨기고 싶다면
  const isSearchBodyPage = location.pathname.startsWith(SEARCH_PATH);

  const isNotActiveSearchBody =
    [SEARCH_PATH].includes(location.pathname) ||
    location.pathname.startsWith(PROFILE_SETTING_PATH);

  return (
    <Container>
      {/* refer: 수정 */}
      <Header>
        <HeaderContainer>
          <HeaderWrap>
            <HeaderSidebarWrap>
              <HeaderSidebarLogoWrap onClick={() => navigate(HOME_PATH)}>
                <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.3}>
                  <FeelogLogo />
                </LongPressToResizeButton>
              </HeaderSidebarLogoWrap>
              <SideNavBar />
            </HeaderSidebarWrap>

            <PoseComposeButtonWrap>
              <PoseComposeButton>게시하기</PoseComposeButton>
            </PoseComposeButtonWrap>
          </HeaderWrap>
        </HeaderContainer>
      </Header>
      <Main id="main">
        <MainContainer>
          <MainWrap>
            <AppContainer>{children}</AppContainer>
            {/* refer: 수정 */}
            <SideBar>
              {!isSearchBodyPage && (
                <>
                  <SearchHeader
                    backToUrl={HOME_PATH}
                    SearchHeaderContainer={{
                      maxWidth: `${SIDE_WIDTH}px`,
                    }}
                    isPrevButton={false}
                  />
                  {isSearchInputActive && (
                    <SearchSuggestBodyWrap>
                      <SearchSuggestBody
                        SearchSuggestBodyContiainerStyle={{
                          maxWidth: `${SIDE_WIDTH}px`,
                        }}
                      />
                    </SearchSuggestBodyWrap>
                  )}
                </>
              )}

              {!isNotActiveSearchBody && (
                <RightSidebarWrapWrap>
                  <SearchBodyWrap>
                    <SearchBody
                      SearchBodyStyle={
                        isSearchBodyPage ? { marginTop: '20px' } : {}
                      }
                    />
                  </SearchBodyWrap>
                </RightSidebarWrapWrap>
              )}
            </SideBar>
          </MainWrap>
        </MainContainer>
      </Main>
    </Container>
  );
};

const CONTAINER_GAP = 70;

const HEADER_WIDTH = 400;

const SIDE_WIDTH = 400;

const Container = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  gap: ${CONTAINER_GAP}px;
`;
const Header = styled.header`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    min-width: ${HEADER_WIDTH}px;
    max-width: ${HEADER_WIDTH}px;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
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

const HeaderSidebarLogoWrap = styled.div`
  padding-top: 20px;
  cursor: pointer;
`;

const HeaderSidebarWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 50px;
`;

const SideBar = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 100%;
    max-width: ${SIDE_WIDTH}px;
    min-width: ${SIDE_WIDTH}px;
  }
`;

const SearchSuggestBodyWrap = styled.div``;

const PoseComposeButtonWrap = styled.div`
  margin-bottom: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bottomButtonMargin};
`;

const PoseComposeButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline2};
  padding: 8px 65px;
  background-color: ${({ theme }) => theme.mainColor.Blue};
  color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
`;

const Main = styled.main`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    width: 100%;
  }
`;

const MainContainer = styled.div``;

const MainWrap = styled.div`
  display: flex;
  gap: ${CONTAINER_GAP}px;
`;

const AppContainer = styled.div`
  width: 100%;

  margin-bottom: 86px;

  // @media (min-width: ${theme.systemSize.appDisplaySize.maxWidth}) {
  //   display: flex;
  //   margin: auto;
  // }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    min-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  }
`;

const SearchBodyWrap = styled.div`
  max-width: ${SIDE_WIDTH}px;
  width: 100%;
  position: fixed;
`;

const RightSidebarWrapWrap = styled.div`
  overflow-y: scroll;
  height: 100vh;
`;

export default AppBaseTemplate;
