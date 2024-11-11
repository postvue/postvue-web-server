import { ReactComponent as SearchWordDeleteButtonIcon } from 'assets/images/icon/svg/SearchWordDeleteButtonIcon.svg';
import { RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE } from 'const/LocalStorageConst';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { SEARCH_POST_PATH } from '../../../const/PathConst';
import { SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME } from '../../../const/SearchConst';
import { SearchRecentKeywordInterface } from '../../../global/interface/localstorage/SearchInterface';
import {
  deleteRecentlyKeyword,
  getRecentSearchWordList,
} from '../../../global/util/SearchUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import { getSearchQuery } from '../../../services/search/getSearchQuery';
import {
  searchQueryRelationHashMapAtom,
  searchTempWordAtom,
} from '../../../states/SearchPostAtom';
import theme from '../../../styles/theme';
import SearchQueryElement from './SearchQueryElement';

interface SearchSuggestBodyProps {
  SearchSuggestBodyContiainerStyle?: React.CSSProperties;
}

const SearchSuggestBody: React.FC<SearchSuggestBodyProps> = ({
  SearchSuggestBodyContiainerStyle,
}) => {
  const navigate = useNavigate();

  const [recentSearchWordList, setRecentSearchWordList] = useState<
    SearchRecentKeywordInterface[]
  >([]);

  const [searchQueryRelationHashMap, setSearchQueryRelationHashMap] =
    useRecoilState(searchQueryRelationHashMapAtom);

  const searchTempWord = useRecoilValue(searchTempWordAtom);

  const onClickDeleteSearchWord = (searchWord: string) => {
    const deletedSearchRecentSearchWordList: SearchRecentKeywordInterface[] =
      deleteRecentlyKeyword(
        RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
        searchWord,
      );

    setRecentSearchWordList(deletedSearchRecentSearchWordList);
  };

  useEffect(() => {
    setRecentSearchWordList(
      getRecentSearchWordList(RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE),
    );

    if (
      !searchQueryRelationHashMap.get(searchTempWord) &&
      isValidString(searchTempWord)
    ) {
      setTimeout(() => {
        getSearchQuery(searchTempWord).then((value) => {
          const tempSearchQueryRelationHashMap = new Map(
            searchQueryRelationHashMap,
          );
          tempSearchQueryRelationHashMap.set(searchTempWord, value);
          setSearchQueryRelationHashMap(tempSearchQueryRelationHashMap);
        });
      }, SEARCH_RELATION_QUERY_DELAY_MIRCE_TIME);
    }

    return () => {
      setRecentSearchWordList([]);
    };
  }, []);

  useEffect(() => {
    console.log(searchQueryRelationHashMap);

    console.log(searchTempWord);
    console.log(searchQueryRelationHashMap.get(searchTempWord));

    searchQueryRelationHashMap.get(searchTempWord)?.map((value, index) => {
      console.log(value, index);
    });
  }, [searchQueryRelationHashMap]);

  return (
    <SearchSuggestBodyContainer style={SearchSuggestBodyContiainerStyle}>
      <SearchRecentWordContainer>
        {!isValidString(searchTempWord) ? (
          <>
            {recentSearchWordList.length > 0 && (
              <>
                <SearchRelatedTitle>최근 검색어</SearchRelatedTitle>
                <SuggestSearchWordContainer>
                  {recentSearchWordList &&
                    recentSearchWordList
                      .slice(0)
                      .reverse()
                      .map((v, i) => (
                        <React.Fragment key={i}>
                          <SearchQueryElement
                            searchQueryWord={v.name}
                            onClickSearchQueryItem={() => {
                              navigate(`${SEARCH_POST_PATH}/${v.name}`);
                            }}
                          >
                            <RecentDeleteButtonWrap
                              onClick={() => onClickDeleteSearchWord(v.name)}
                            >
                              <SearchWordDeleteButtonIcon />
                            </RecentDeleteButtonWrap>
                          </SearchQueryElement>
                        </React.Fragment>
                      ))}
                </SuggestSearchWordContainer>
              </>
            )}
          </>
        ) : (
          <>
            <SuggestSearchWordContainer>
              {searchQueryRelationHashMap
                .get(searchTempWord)
                ?.map((value, index) => (
                  <React.Fragment key={index}>
                    <SearchQueryElement
                      searchQueryWord={value}
                      onClickSearchQueryItem={() => {
                        navigate(`${SEARCH_POST_PATH}/${value}`);
                      }}
                    ></SearchQueryElement>
                  </React.Fragment>
                ))}
            </SuggestSearchWordContainer>
          </>
        )}
      </SearchRecentWordContainer>
    </SearchSuggestBodyContainer>
  );
};

const SearchSuggestBodyContainer = styled.div`
  height: calc(100% - ${theme.systemSize.header.height});
  position: absolute;
  top: ${theme.systemSize.header.height};
  width: 100%;

  background-color: ${({ theme }) => theme.mainColor.White};
  z-index: 20;
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  padding-bottom: 12px;
`;

const SearchRecentWordContainer = styled.div`
  margin: 22px 21px 41px 21px;
`;

const SuggestSearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 18px;
`;

const RecentDeleteButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

export default SearchSuggestBody;
