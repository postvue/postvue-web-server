import React, { useEffect, useState } from 'react';

import SearchHeader from 'components/search/header/SearchHeader';
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
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import PostSearchFilterPopup from 'components/popups/search/PostSearchFilterPopup';
import SearchTagPostBody from 'components/search/body/SearchTagPostBody';
import { SEARCH_TAG_POST_PATH } from 'const/PathConst';
import { GetSearchTermRsp } from 'global/interface/search';
import { getSearchTermInfo } from 'services/search/getSearchTermInfo';

const SearchTagPostPage: React.FC = () => {
  const [isSearchInputActive, setIsSearchInputActive] = useRecoilState(
    isSearchInputActiveAtom,
  );

  const isActiveSearchPostFilterPopup = useRecoilValue(
    isActiveSearchPostFilterPopupAtom,
  );

  const searchWord = useRecoilValue(searchWordAtom);

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const [searchTermInfo, setSearchTermInfo] = useState<
    GetSearchTermRsp | undefined
  >();
  useEffect(() => {
    if (!searchWord) return;
    getSearchTermInfo(searchWord).then((v) => {
      setSearchTermInfo(v);
    });
  }, [searchWord]);

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
        SideContainerStyle={{
          height: '100dvh',
        }}
        SideSearchBodyWrapStyle={{ top: '10px' }}
      >
        <SearchHeader
          searchUrl={SEARCH_TAG_POST_PATH}
          backToUrl={SEARCH_PATH}
          isShowFavoriteTermButton={true && !isSearchInputActive}
          favoriteTermButton={
            searchTermInfo &&
            ((searchTermInfo.isTag && searchTermInfo.isExistTag) ||
              !searchTermInfo.isTag) && (
              <SearchFavoriteTermButton
                searchWord={searchTermInfo.favoriteTermName}
                isFavoriteTerm={searchTermInfo.isFavoriteTerm}
                searchQueryAndFilterKey={searchQueryAndFilterKey}
              />
            )
          }
        />

        <SearchTagPostBody />

        <BottomNavBar />
        {isActiveSearchPostFilterPopup && (
          <PostSearchFilterPopup searchWord={searchWord} />
        )}
      </AppBaseTemplate>
    </>
  );
};

export default SearchTagPostPage;
