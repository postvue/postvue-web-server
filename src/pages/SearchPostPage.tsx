import React from 'react';

import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import SearchPostBody from '../components/search/body/SearchPostBody';
import SearchHeader from '../components/search/header/SearchHeader';
import { SEARCH_PATH } from '../const/PathConst';

const SearchPostPage: React.FC = () => {
  return (
    <AppBaseTemplate>
      <SearchHeader backToUrl={SEARCH_PATH} />
      <SearchPostBody />
      <BottomNavBar />
    </AppBaseTemplate>
  );
};

export default SearchPostPage;
