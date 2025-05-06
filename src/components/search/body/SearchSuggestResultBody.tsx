import { SEARCH_PAGE_PROFILE_TAB_ID } from 'const/TabConfigConst';
import React from 'react';
import styled from 'styled-components';
import { SearchTabInfo } from '../../../states/SearchPostAtom';
import SearchScrapSubBody from './SearchScrapSubBody';
import SearchSuggestProfileResultBody from './SearchSuggestProfileResultBody';

interface SearchSuggestBodyProps {
  searchTabInfo: SearchTabInfo;
  searchWord: string;
  searchTempWordQuery: string;
}

const SearchSuggestResultBody: React.FC<SearchSuggestBodyProps> = ({
  searchTabInfo,
  searchWord,
  searchTempWordQuery,
}) => {
  return (
    <SuggestSearchWordContainer>
      {searchTabInfo.tabId === SEARCH_PAGE_PROFILE_TAB_ID ? (
        <SearchSuggestProfileResultBody
          searchTempWordQuery={searchTempWordQuery}
        />
      ) : (
        <SearchScrapSubBody searchWord={searchTempWordQuery} />
      )}
    </SuggestSearchWordContainer>
  );
};

const SuggestSearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

export default SearchSuggestResultBody;
