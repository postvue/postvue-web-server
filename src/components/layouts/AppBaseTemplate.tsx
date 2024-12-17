import SideNavBar from 'components/SideNavBar';
import React, { ReactNode, useRef } from 'react';
import styled from 'styled-components';

import PostComposePopup from 'components/popups/postcompose/PostComposePopup';
import PostComposeSelectPopup from 'components/popups/postcompose/PostComposeSelectPopup';
import PostComposeBySourceUrlPopup from 'components/popups/postcompose/postcomposesourceurlpopup/PostComposeBySourceUrlPopup';
import PostEditPopup from 'components/popups/postedit/PostEditPopup';
import ProfilePostDetailPopup from 'components/popups/ProfilePostDetailPopup';
import PostSearchFilterPopupBody from 'components/popups/search/PostSearchFilterPopupBody';
import SnsSharePopup from 'components/popups/SnsSharePopup';
import SearchBody from 'components/search/body/SearchBody';
import SearchSuggestBody from 'components/search/body/SearchSuggestBody';
import SearchHeader from 'components/search/header/SearchHeader';
import {
  HOME_PATH,
  PROFILE_SETTING_PATH,
  SEARCH_PATH,
  SEARCH_POST_PATH,
} from 'const/PathConst';
import {
  MEDIA_MIDDLE_1300_WIDTH,
  MEDIA_MIDDLE_1400_WIDTH,
  MEDIA_MIDDLE_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { isValidString } from 'global/util/ValidUtil';
import useOutsideClick from 'hook/customhook/useOutsideClick';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateSearchFavoriteTermList } from 'hook/queryhook/QueryStateSearchFavoriteTermList';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  isPostDetailInfoPopupAtom,
  postDetailInfoPopupAtom,
} from 'states/PostAtom';
import {
  isActivPostComposeBySourceUrlPopupAtom,
  isActivPostComposePopupAtom,
  isActivPostComposeSelectPopupAtom,
  postEditActiveInfoPopupAtom,
} from 'states/PostComposeAtom';
import { isSearchInputActiveAtom, searchWordAtom } from 'states/SearchPostAtom';
import { sharePopupInfoAtom } from 'states/ShareAtom';
import { borderShadowStyle_prop } from 'styles/commonStyles';
import theme from 'styles/theme';

interface AppBaseTemplate {
  children: ReactNode;
  slideBarNode?: ReactNode;
  SlideBarNodeStyle?: React.CSSProperties;
  hasSearchInputModule?: boolean;
  hasSearchBodyModule?: boolean;
  hasPostSearchFilterPopupBody?: boolean;
  SideContainerStyle?: React.CSSProperties;
  SideBarNodeWrapStyle?: React.CSSProperties;
  SideSearchBodyWrapStyle?: React.CSSProperties;
  AppContainerStyle?: React.CSSProperties;
  isTransparentSearchButton?: boolean;
  isDisplayFavoriteTerm?: boolean;
  isAppContainerTopMargin?: boolean;
}

const AppBaseTemplate: React.FC<AppBaseTemplate> = ({
  children,
  slideBarNode,
  hasSearchInputModule = true,
  hasSearchBodyModule = true,
  hasPostSearchFilterPopupBody = false,
  SideContainerStyle,
  SlideBarNodeStyle,
  SideBarNodeWrapStyle,
  SideSearchBodyWrapStyle,
  AppContainerStyle,
  isTransparentSearchButton = false,
  isDisplayFavoriteTerm = true,
  isAppContainerTopMargin = true,
}) => {
  const [isSearchInputActive, setIsSearchInputActive] = useRecoilState(
    isSearchInputActiveAtom,
  );
  const searchWord = useRecoilValue(searchWordAtom);

  const location = useLocation();

  // '/search' 경로로 시작하는 경우 모듈을 숨기고 싶다면
  const isSearchBodyPage = location.pathname.startsWith(`${SEARCH_PATH}/`);

  const isActivePostComposeBySourceUrlPopup = useRecoilValue(
    isActivPostComposeBySourceUrlPopupAtom,
  );
  const isActivePostComposePopup = useRecoilValue(isActivPostComposePopupAtom);
  const postEditActiveInfoPopup = useRecoilValue(postEditActiveInfoPopupAtom);
  const sharePopupInfo = useRecoilValue(sharePopupInfoAtom);
  const isActivePostComposeSelectPopup = useRecoilValue(
    isActivPostComposeSelectPopupAtom,
  );

  const postDetailInfoPopup = useRecoilValue(postDetailInfoPopupAtom);

  const isPostDetailInfoPopup = useRecoilValue(isPostDetailInfoPopupAtom);

  const isNotActiveSearchBody =
    [SEARCH_PATH].includes(location.pathname) ||
    location.pathname.startsWith(PROFILE_SETTING_PATH);

  const {
    data: searchFavoriteTermList,
    isFetched: isFetchedBySearchFavoriteTermList,
  } = QueryStateSearchFavoriteTermList();

  // SuggestBody를 감싸는 Ref 생성
  const suggestBodyRef = useRef<HTMLDivElement>(null);

  const { windowWidth } = useWindowSize();
  useOutsideClick([suggestBodyRef], () => setIsSearchInputActive(false));
  return (
    <>
      <Container id="app">
        {/* refer: 수정 */}
        {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM && (
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
              <AppContainer
                style={AppContainerStyle}
                $isAppContainerTopMargin={isAppContainerTopMargin}
              >
                {children}
              </AppContainer>
              {/* refer: 수정 */}
              {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM && (
                <SideBar style={SideContainerStyle}>
                  {hasSearchInputModule && (
                    <div ref={suggestBodyRef}>
                      <SearchHeader
                        backToUrl={HOME_PATH}
                        searchUrl={SEARCH_POST_PATH}
                        SearchHeaderContainerStyle={{
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
                        <SearchSuggestBody
                          SearchSuggestBodyContiainerStyle={{
                            width: `${SIDE_WIDTH}px`,
                            position: 'fixed',
                            height: `${SUGGEST_BODY_HEIGHT}px`,
                            marginTop: '10px',
                          }}
                          SearchSuggestBodyWrapStyle={{
                            padding: '15px',
                            margin: '0px',
                          }}
                          SearchSearchWordContainerStyle={{
                            overflow: 'scroll',
                            overscrollBehavior: 'contain',
                            height: 'calc(100% - 50px)',
                          }}
                        />
                      )}
                    </div>
                  )}
                  {hasPostSearchFilterPopupBody && (
                    <PostSearchFilterPopupBody
                      searchWord={searchWord}
                      FilterPopupContainrStyle={{
                        margin: `8px 20px 0 20px`,
                        border: `1px solid ${theme.grey.Grey2}`,
                        borderRadius: '20px',
                        paddingTop: '20px',
                      }}
                      FilterPopupTitleStyle={{
                        textAlign: 'start',
                        padding: `0px ${theme.systemSize.appDisplaySize.bothSidePadding} 20px ${theme.systemSize.appDisplaySize.bothSidePadding}`,
                      }}
                    />
                  )}

                  {hasSearchBodyModule && !isNotActiveSearchBody && (
                    <SearchBodyWrap
                      style={SideSearchBodyWrapStyle}
                      $isSearchPage={isSearchBodyPage}
                      $isActiveSearchFavoriteTermList={
                        !(
                          searchFavoriteTermList === undefined ||
                          (searchFavoriteTermList &&
                            searchFavoriteTermList.length <= 0)
                        ) && isFetchedBySearchFavoriteTermList
                      }
                    >
                      <SearchBody
                        isDisplayFavoriteTerm={isDisplayFavoriteTerm}
                      />
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
        {isPostDetailInfoPopup && isValidString(postDetailInfoPopup.postId) && (
          <ProfilePostDetailPopup />
        )}
        {sharePopupInfo.isActive && <SnsSharePopup />}
        {isActivePostComposeSelectPopup && <PostComposeSelectPopup />}
        {isActivePostComposeBySourceUrlPopup && <PostComposeBySourceUrlPopup />}
        {isActivePostComposePopup &&
          windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM && <PostComposePopup />}
        {postEditActiveInfoPopup.isActive &&
          windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM && (
            <PostEditPopup postId={postEditActiveInfoPopup.postId} />
          )}
      </Container>
    </>
  );
};

const CONTAINER_GAP = 70;
const CONTAINER_MIN_GAP = 30;

const HEADER_WIDTH = 400;

const SIDE_WIDTH = 400;

const RightSideHeaderMargin = 8;

const SUGGEST_BODY_HEIGHT = 500;

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
  height: 100dvh;
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

const AppContainer = styled.div<{ $isAppContainerTopMargin: boolean }>`
  width: 100%;
  position: relative;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
    min-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
    margin-bottom: 8px;
    min-height: calc(100dvh - 8px);
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
    margin: auto;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 20px 0px;
    min-height: calc(
      100dvh -
        ${(props) =>
          props.$isAppContainerTopMargin
            ? `${theme.systemSize.header.height}`
            : '0px'}
    );
    padding-top: ${(props) =>
      props.$isAppContainerTopMargin
        ? `${theme.systemSize.header.height}`
        : '0px'};
  }
`;

const SearchBodyWrap = styled.div<{
  $isSearchPage: boolean;
  $isActiveSearchFavoriteTermList: boolean;
}>`
  width: 100%;
  position: sticky;

  padding-top: ${(props) =>
    props.$isSearchPage ? '0px' : `${theme.systemSize.header.height}`};
  top: ${(props) =>
    props.$isActiveSearchFavoriteTermList
      ? props.$isSearchPage
        ? `-160px`
        : '-180px'
      : '0px'};
`;

const SideBarNodeWrap = styled.div`
  width: 100%;
  position: relative;
  height: calc(100dvh - ${RightSideHeaderMargin * 2}px);
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
