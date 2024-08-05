import React, { useEffect } from 'react';

import { useResetRecoilState } from 'recoil';
import TabBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import SearchBody from '../components/search/body/SearchBody';
import SearchHeader from '../components/search/header/SearchHeader';
import { HOME_PATH } from '../const/PathConst';
import { searchWordAtom } from '../states/SearchPostAtom';

const SearchPage: React.FC = () => {
  const resetSearchWord = useResetRecoilState(searchWordAtom);
  useEffect(() => {
    resetSearchWord();
  }, []);
  return (
    <AppBaseTemplate>
      <SearchHeader backToUrl={HOME_PATH} />
      <SearchBody />
      <TabBar />
    </AppBaseTemplate>
  );
};

export default SearchPage;
