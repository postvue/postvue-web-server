import React from 'react';

import SearchPostBody from 'components/search/body/SearchPostBody';
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
import { SEARCH_POST_PATH } from 'const/PathConst';
import { QueryStateSearchTermInfo } from 'hook/queryhook/QueryStateSearchTermInfo';

const SearchPostPage: React.FC = () => {
  const [isSearchInputActive, setIsSearchInputActive] = useRecoilState(
    isSearchInputActiveAtom,
  );

  const isActiveSearchPostFilterPopup = useRecoilValue(
    isActiveSearchPostFilterPopupAtom,
  );

  const searchWord = useRecoilValue(searchWordAtom);

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const { data: searchTermInfo } = QueryStateSearchTermInfo(searchWord);

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
          searchUrl={SEARCH_POST_PATH}
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

        <SearchPostBody />

        <BottomNavBar />
        {isActiveSearchPostFilterPopup && (
          <PostSearchFilterPopup searchWord={searchWord} />
        )}
      </AppBaseTemplate>
    </>
  );
};

export default SearchPostPage;
