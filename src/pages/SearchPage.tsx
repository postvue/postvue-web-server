import React, { useEffect } from 'react';

import { useRecoilValue, useResetRecoilState } from 'recoil';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import SearchBody from '../components/search/body/SearchBody';

import SearchHeader from 'components/search/header/SearchHeader';
import BottomNavBar from '../components/BottomNavBar';
import SearchSuggestBody from '../components/search/body/SearchSuggestBody';
import { HOME_PATH } from '../const/PathConst';
import {
  isSearchInputActiveAtom,
  searchWordAtom,
} from '../states/SearchPostAtom';

const SearchPage: React.FC = () => {
  const isSearchInputActive = useRecoilValue(isSearchInputActiveAtom);
  const resetSearchWord = useResetRecoilState(searchWordAtom);
  useEffect(() => {
    resetSearchWord();
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppBaseTemplate>
      <SearchHeader backToUrl={HOME_PATH} />
      <SearchBody />
      {isSearchInputActive && <SearchSuggestBody />}
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default SearchPage;
