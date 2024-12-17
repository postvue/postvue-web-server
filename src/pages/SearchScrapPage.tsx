import React, { useRef } from 'react';

import SearchSuggestBody from 'components/search/body/SearchSuggestBody';
import SearchHeader from 'components/search/header/SearchHeader';
import { NAVIGATION_BACK } from 'const/AppConst';
import { useRecoilState, useRecoilValue } from 'recoil';
import { SEARCH_PATH } from 'services/appApiPath';
import {
  isActiveSearchPostFilterPopupAtom,
  isSearchInputActiveAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

import PostSearchFilterPopup from 'components/popups/search/PostSearchFilterPopup';
import SearchScrapBody from 'components/search/body/SearchScrapBody';
import { SEARCH_SCRAP_PATH } from 'const/PathConst';
import useOutsideClick from 'hook/customhook/useOutsideClick';

const SearchScrapPage: React.FC = () => {
  const [isSearchInputActive, setIsSearchInputActive] = useRecoilState(
    isSearchInputActiveAtom,
  );

  const isActiveSearchPostFilterPopup = useRecoilValue(
    isActiveSearchPostFilterPopupAtom,
  );

  const searchWord = useRecoilValue(searchWordAtom);

  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const suggestBodyRef = useRef<HTMLDivElement>(null);

  useOutsideClick([suggestBodyRef, searchHeaderRef], () => {
    setIsSearchInputActive(false);
  });

  return (
    <AppBaseTemplate
      hasSearchInputModule={false}
      isDisplayFavoriteTerm={false}
      SideSearchBodyWrapStyle={{ top: '10px' }}
      hasPostSearchFilterPopupBody={true}
    >
      <SearchHeader
        searchHeaderRef={searchHeaderRef}
        searchUrl={SEARCH_SCRAP_PATH}
        backToUrl={SEARCH_PATH}
        navigateType={NAVIGATION_BACK}
        isShowFavoriteTermButton={false}
      />
      {isSearchInputActive && (
        <SearchSuggestBody suggestBodyRef={suggestBodyRef} />
      )}
      <SearchScrapBody />

      <PostSearchFilterPopup searchWord={searchWord} />

      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default SearchScrapPage;
