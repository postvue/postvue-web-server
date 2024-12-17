import React, { useRef } from 'react';

import SearchPostBody from 'components/search/body/SearchPostBody';
import SearchSuggestBody from 'components/search/body/SearchSuggestBody';
import SearchHeader from 'components/search/header/SearchHeader';
import { NAVIGATION_BACK } from 'const/AppConst';
import { useRecoilState, useRecoilValue } from 'recoil';
import { SEARCH_PATH } from 'services/appApiPath';
import {
  isActiveSearchPostFilterPopupAtom,
  isSearchInputActiveAtom,
  searchQueryAndFilterKeyAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

import SearchFavoriteTermButton from 'components/common/buttton/SearchFavoriteTermButton';
import PostSearchFilterPopup from 'components/popups/search/PostSearchFilterPopup';
import { SEARCH_POST_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useOutsideClick from 'hook/customhook/useOutsideClick';
import useWindowSize from 'hook/customhook/useWindowSize';
import theme from 'styles/theme';

const SearchPostPage: React.FC = () => {
  const [isSearchInputActive, setIsSearchInputActive] = useRecoilState(
    isSearchInputActiveAtom,
  );

  const isActiveSearchPostFilterPopup = useRecoilValue(
    isActiveSearchPostFilterPopupAtom,
  );

  const searchWord = useRecoilValue(searchWordAtom);

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const suggestBodyRef = useRef<HTMLDivElement>(null);

  useOutsideClick([suggestBodyRef, searchHeaderRef], () => {
    setIsSearchInputActive(false);
  });

  const { windowWidth } = useWindowSize();

  return (
    <>
      <AppBaseTemplate
        hasSearchInputModule={false}
        isDisplayFavoriteTerm={false}
        SideSearchBodyWrapStyle={{ top: '10px' }}
        hasPostSearchFilterPopupBody={true}
        AppContainerStyle={
          windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
            ? { marginTop: `${theme.systemSize.header.heightNumber}px` }
            : {}
        }
      >
        <SearchHeader
          searchHeaderRef={searchHeaderRef}
          searchUrl={SEARCH_POST_PATH}
          backToUrl={SEARCH_PATH}
          navigateType={NAVIGATION_BACK}
          isShowFavoriteTermButton={true && !isSearchInputActive}
          favoriteTermButton={
            <SearchFavoriteTermButton
              searchWord={searchWord}
              searchQueryAndFilterKey={searchQueryAndFilterKey}
            />
          }
        />
        {isSearchInputActive && (
          <SearchSuggestBody suggestBodyRef={suggestBodyRef} />
        )}
        <SearchPostBody />

        <BottomNavBar />
        <PostSearchFilterPopup searchWord={searchWord} />
      </AppBaseTemplate>
    </>
  );
};

export default SearchPostPage;
