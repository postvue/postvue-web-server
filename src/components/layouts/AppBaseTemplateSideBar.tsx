import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

import PostSearchFilterPopupBody from 'components/popups/search/PostSearchFilterPopupBody';
import SearchBodyEditComponent from 'components/search/body/SearchBodyEditComponent';
import SearchBodyRecommComponent from 'components/search/body/SearchBodyRecommComponent';
import SearchPostExploreFilter from 'components/search/body/SearchPostExploreFilter';
import SearchHeader from 'components/search/header/SearchHeader';
import {
  HOME_PATH,
  PROFILE_POST_LIST_PATH,
  PROFILE_SETTING_PATH,
  SEARCH_PATH,
  SEARCH_POST_PATH,
} from 'const/PathConst';
import { MEDIA_MIDDLE_1300_WIDTH } from 'const/SystemAttrConst';
import { useLocation, useMatch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { searchWordAtom } from 'states/SearchPostAtom';
import { borderShadowStyle_prop } from 'styles/commonStyles';
import theme from 'styles/theme';

interface AppBaseTemplateSideBar {
  slideBarNode?: ReactNode;
  SlideBarNodeStyle?: React.CSSProperties;
  hasSearchInputModule?: boolean;
  hasSearchBodyModule?: boolean;
  hasPostSearchFilterPopupBody?: boolean;
  SideContainerStyle?: React.CSSProperties;
  SideBarNodeWrapStyle?: React.CSSProperties;
  SideSearchBodyWrapStyle?: React.CSSProperties;
  isTransparentSearchButton?: boolean;
  isScrollByAppContainer: boolean;
  isDisplayFavoriteTerm?: boolean;
  sideWidth: number;
}

const AppBaseTemplateSideBar: React.FC<AppBaseTemplateSideBar> = ({
  slideBarNode,
  hasSearchInputModule = true,
  hasSearchBodyModule = true,
  hasPostSearchFilterPopupBody = false,
  SideContainerStyle,
  SlideBarNodeStyle,
  SideBarNodeWrapStyle,
  SideSearchBodyWrapStyle,
  isTransparentSearchButton = false,
  isDisplayFavoriteTerm = true,
  isScrollByAppContainer,
  sideWidth,
}) => {
  const searchWord = useRecoilValue(searchWordAtom);

  const location = useLocation();

  const isNotActiveSearchBody =
    [SEARCH_PATH].includes(location.pathname) ||
    location.pathname.startsWith(PROFILE_SETTING_PATH);

  const isSearchPostPage = location.pathname.startsWith(SEARCH_POST_PATH);

  const isProfilePostPath = useMatch(PROFILE_POST_LIST_PATH);

  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <>
      <SideBar
        style={SideContainerStyle}
        $sideWidth={sideWidth}
        $isScrollByAppContainer={isScrollByAppContainer}
      >
        {hasSearchInputModule && (
          <SearchHeader
            backToUrl={HOME_PATH}
            searchUrl={SEARCH_POST_PATH}
            SearchButtonInputLayoutStyle={
              !isProfilePostPath
                ? {
                    backgroundColor: 'white',
                    border: `1px solid ${theme.grey.Grey2}`,
                  }
                : {}
            }
            SearchHeaderContainerStyle={{
              width: `${sideWidth}px`,
              backgroundColor: isTransparentSearchButton ? 'transparent' : '',

              marginTop: isProfilePostPath ? '10px' : '0',
              position: isScrollByAppContainer ? 'fixed' : 'sticky',
            }}
            isPrevButton={false}
            SearchSuggestBodyContiainerStyle={{
              position: 'absolute',
              maxWidth: `${sideWidth - 2}px`,
              border: `1px solid ${theme.grey.Grey2}`,
            }}
          />
        )}
        {hasPostSearchFilterPopupBody && (
          <SearchFilterPopupBodyWrap>
            <PostSearchFilterPopupBody
              searchWord={searchWord}
              FilterPopupContainrStyle={{}}
              FilterPopupTitleStyle={{
                textAlign: 'start',
                padding: `0px ${theme.systemSize.appDisplaySize.bothSidePadding} 10px ${theme.systemSize.appDisplaySize.bothSidePadding}`,
                fontSize: '16px',
              }}
              FilterTargetNameStyle={{
                fontSize: '14px',
              }}
            />

            {isSearchPostPage && (
              <>
                <SearchPostExploreFilterTitle>
                  둘러보기
                </SearchPostExploreFilterTitle>
                <SearchPostExploreFilterBodyWrap>
                  <SearchPostExploreFilter
                    SearchPostExploreFilterStyle={{ padding: 0 }}
                  />
                </SearchPostExploreFilterBodyWrap>
              </>
            )}
          </SearchFilterPopupBodyWrap>
        )}

        {hasSearchBodyModule && !isNotActiveSearchBody && (
          <>
            <SearchBodyEditComponent
              size={size}
              isDisplayFavoriteTerm={isDisplayFavoriteTerm}
            />
            <SearchBodyRecommComponent
              size={size}
              onSetSize={(size) => setSize(size)}
              SearchTagRecommContainerStyle={{
                position: 'sticky',
                top: '60px',
              }}
            />
          </>
        )}
        {slideBarNode && (
          <RightSidebarWrapWrap
            style={SlideBarNodeStyle}
            $sideWidth={sideWidth}
          >
            <SideBarNodeWrap style={SideBarNodeWrapStyle}>
              {slideBarNode}
            </SideBarNodeWrap>
          </RightSidebarWrapWrap>
        )}
      </SideBar>
    </>
  );
};

const RightSideHeaderMargin = 8;

const SideBar = styled.div<{
  $sideWidth: number;
  $isScrollByAppContainer: boolean;
}>`
  position: ${(props) => (props.$isScrollByAppContainer ? 'relative' : '')};
  overflow: ${(props) => (props.$isScrollByAppContainer ? 'scroll' : '')};
  height: ${(props) => (props.$isScrollByAppContainer ? '100dvh' : 'auto')};

  max-width: ${(props) => props.$sideWidth}px;
  min-width: ${(props) => props.$sideWidth}px;

  @media (max-width: ${MEDIA_MIDDLE_1300_WIDTH}) {
    padding-right: 10px;
  }
`;

const SearchBodyWrap = styled.div<{ $hasSearchInputModule: boolean }>`
  width: 100%;
  position: sticky;
  margin-top: ${(props) =>
    props.$hasSearchInputModule
      ? theme.systemSize.header.heightNumber + 10
      : 10}px;
`;

const SideBarNodeWrap = styled.div`
  width: 100%;
  position: relative;
  height: calc(100dvh - ${RightSideHeaderMargin * 2}px);
`;

const RightSidebarWrapWrap = styled.div<{ $sideWidth: number }>`
  margin-top: ${RightSideHeaderMargin}px;
  max-width: ${(props) => props.$sideWidth}px;
  min-width: ${(props) => props.$sideWidth}px;
  position: fixed;

  border-radius: 20px;
  box-shadow: ${borderShadowStyle_prop};
`;

const SearchFilterPopupBodyWrap = styled.div`
  margin: 8px 20px 0 20px;
  border: 1px solid ${theme.grey.Grey2};
  border-radius: 20px;
  padding-top: 20px;
  margin-bottom: 15px;
`;

const SearchPostExploreFilterTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  padding: 10px ${theme.systemSize.appDisplaySize.bothSidePadding} 10px
    ${theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SearchPostExploreFilterBodyWrap = styled.div`
  padding: 0px ${theme.systemSize.appDisplaySize.bothSidePadding} 20px
    ${theme.systemSize.appDisplaySize.bothSidePadding};
`;

export default AppBaseTemplateSideBar;
