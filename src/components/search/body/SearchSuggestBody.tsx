import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { SEARCH_PATH } from '../../../const/PathConst';
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
      deleteRecentlyKeyword(searchWord);

    setRecentSearchWordList(deletedSearchRecentSearchWordList);
  };

  useEffect(() => {
    setRecentSearchWordList(getRecentSearchWordList());

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

  return (
    <SearchSuggestBodyContainer style={SearchSuggestBodyContiainerStyle}>
      <SearchRecentWordContainer>
        {!isValidString(searchTempWord) ? (
          <>
            {recentSearchWordList.length > 0 && (
              <>
                <SearchRelatedTitle>최근 검색어</SearchRelatedTitle>
                <RecentSearchWordContainer>
                  {recentSearchWordList &&
                    recentSearchWordList
                      .slice(0)
                      .reverse()
                      .map((v, i) => (
                        <React.Fragment key={i}>
                          <SearchQueryElement
                            searchQueryWord={v.name}
                            onClickSearchQueryItem={() => {
                              navigate(`${SEARCH_PATH}/${v.name}`);
                            }}
                          >
                            <RecentDeleteButtonWrap
                              onClick={() => onClickDeleteSearchWord(v.name)}
                            >
                              <RecentSearchWordDeleteButton
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_193_2900)">
                                  <path
                                    d="M3.99997 4.00003L11.9999 12M3.99997 12L11.9999 4.00003"
                                    stroke="#9199A1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_193_2900">
                                    <rect width="16" height="16" fill="white" />
                                  </clipPath>
                                </defs>
                              </RecentSearchWordDeleteButton>
                            </RecentDeleteButtonWrap>
                          </SearchQueryElement>
                        </React.Fragment>
                      ))}
                </RecentSearchWordContainer>
              </>
            )}
          </>
        ) : (
          <>
            {recentSearchWordList.length > 0 && (
              <>
                <RecentSearchWordContainer>
                  {searchQueryRelationHashMap
                    .get(searchTempWord)
                    ?.map((value, index) => (
                      <React.Fragment key={index}>
                        <SearchQueryElement
                          searchQueryWord={value}
                          onClickSearchQueryItem={() => {
                            navigate(`${SEARCH_PATH}/${value}`);
                          }}
                        ></SearchQueryElement>
                      </React.Fragment>
                    ))}
                </RecentSearchWordContainer>
              </>
            )}
          </>
        )}
      </SearchRecentWordContainer>
    </SearchSuggestBodyContainer>
  );
};

const SearchSuggestBodyContainer = styled.div`
  height: calc(100% - ${theme.systemSize.header.height});
  position: fixed;
  top: ${theme.systemSize.header.height};
  width: 100%;
  max-width: ${theme.systemSize.appDisplaySize.maxWidth};
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

const RecentSearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 18px;
`;

const RecentDeleteButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
`;

const RecentSearchWordDeleteButton = styled.svg`
  margin: auto 0;
`;

export default SearchSuggestBody;
