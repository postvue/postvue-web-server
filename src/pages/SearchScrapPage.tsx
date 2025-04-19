import React from 'react';

import SearchHeader from 'components/search/header/SearchHeader';
import { useRecoilValue } from 'recoil';
import { SEARCH_PATH } from 'services/appApiPath';
import {
  isActiveSearchPostFilterPopupAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import PostSearchFilterPopup from 'components/popups/search/PostSearchFilterPopup';
import SearchScrapBody from 'components/search/body/SearchScrapBody';
import { SEARCH_SCRAP_PATH } from 'const/PathConst';

const SearchScrapPage: React.FC = () => {
  const isActiveSearchPostFilterPopup = useRecoilValue(
    isActiveSearchPostFilterPopupAtom,
  );

  const searchWord = useRecoilValue(searchWordAtom);

  return (
    <>
      <PageHelmentInfoElement
        title={searchWord}
        ogTitle={searchWord}
        ogUrl={window.location.href}
        ogDescription={searchWord}
      />
      <AppBaseTemplate
        hasSearchInputModule={false}
        isDisplayFavoriteTerm={false}
        SideContainerStyle={{
          position: 'sticky',
          top: '0px',
          overflow: 'scroll',
          overscrollBehavior: 'none',
          height: '100dvh',
        }}
        SideSearchBodyWrapStyle={{ top: '10px' }}
        hasPostSearchFilterPopupBody={true}
      >
        <SearchHeader
          searchUrl={SEARCH_SCRAP_PATH}
          backToUrl={SEARCH_PATH}
          isShowFavoriteTermButton={false}
        />

        <SearchScrapBody />

        {isActiveSearchPostFilterPopup && (
          <PostSearchFilterPopup searchWord={searchWord} />
        )}

        <BottomNavBar />
      </AppBaseTemplate>
    </>
  );
};

export default SearchScrapPage;
