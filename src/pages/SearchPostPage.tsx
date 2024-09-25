import React from 'react';

import SearchPostBody from 'components/search/body/SearchPostBody';
import SearchSuggestBody from 'components/search/body/SearchSuggestBody';
import SearchHeader from 'components/search/header/SearchHeader';
import { NAVIGATION_BACK } from 'const/AppConst';
import { useRecoilValue } from 'recoil';
import { SEARCH_PATH } from 'services/appApiPath';
import {
  isSearchInputActiveAtom,
  searchQueryAndFilterKeyAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import ToastPopup from '../components/popups/ToastMsgPopup';

import SearchFavoriteTermButton from 'components/common/buttton/SearchFavoriteTermButton';

const SearchPostPage: React.FC = () => {
  const isSearchInputActive = useRecoilValue(isSearchInputActiveAtom);

  const searchWord = useRecoilValue(searchWordAtom);

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  return (
    <AppBaseTemplate>
      <SearchHeader
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
      <SearchPostBody />
      {isSearchInputActive && <SearchSuggestBody />}
      <ToastPopup />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default SearchPostPage;
