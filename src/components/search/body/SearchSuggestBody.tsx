import { ReactComponent as SearchWordDeleteButtonIcon } from 'assets/images/icon/svg/SearchWordDeleteButtonIcon.svg';
import { RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE } from 'const/LocalStorageConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { stackRouterPush } from 'global/util/reactnative/StackRouter';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { SEARCH_POST_PATH } from '../../../const/PathConst';
import { SearchRecentKeywordInterface } from '../../../global/interface/localstorage/SearchInterface';
import {
  deleteRecentlyKeyword,
  getRecentSearchWordList,
} from '../../../global/util/SearchUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import { getSearchQuery } from '../../../services/search/getSearchQuery';
import {
  isSearchInputActiveAtom,
  searchQueryRelationHashMapAtom,
  searchTempWordAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';
import theme from '../../../styles/theme';
import SearchQueryElement from './SearchQueryElement';

interface SearchSuggestBodyProps {
  SearchSuggestBodyContiainerStyle?: React.CSSProperties;
  SearchSuggestBodyWrapStyle?: React.CSSProperties;
  SearchSearchWordContainerStyle?: React.CSSProperties;
  suggestBodyRef?: React.RefObject<HTMLDivElement>;
}

const SearchSuggestBody: React.FC<SearchSuggestBodyProps> = ({
  SearchSuggestBodyContiainerStyle,
  SearchSuggestBodyWrapStyle,
  SearchSearchWordContainerStyle,
  suggestBodyRef,
}) => {
  const navigate = useNavigate();

  const [recentSearchWordList, setRecentSearchWordList] = useState<
    SearchRecentKeywordInterface[]
  >([]);

  const [searchQueryRelationHashMap, setSearchQueryRelationHashMap] =
    useRecoilState(searchQueryRelationHashMapAtom);

  const setIsSearchInputActive = useSetRecoilState(isSearchInputActiveAtom);

  const searchWord = useRecoilValue(searchWordAtom);
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
      getSearchQuery(searchTempWord).then((value) => {
        const tempSearchQueryRelationHashMap = new Map(
          searchQueryRelationHashMap,
        );
        tempSearchQueryRelationHashMap.set(searchTempWord, value);
        setSearchQueryRelationHashMap(tempSearchQueryRelationHashMap);
      });
    }

    return () => {
      setRecentSearchWordList([]);
    };
  }, []);

  const onNavigate = (word: string) => {
    setIsSearchInputActive(false);
    if (searchWord === word) return;
    stackRouterPush(navigate, `${SEARCH_POST_PATH}/${word}`);
  };

  return (
    <SearchSuggestBodyContainer
      style={SearchSuggestBodyContiainerStyle}
      ref={suggestBodyRef}
    >
      <SearchRecentWordContainer style={SearchSuggestBodyWrapStyle}>
        {!isValidString(searchTempWord) ? (
          <>
            {recentSearchWordList.length > 0 && (
              <>
                <SearchRelatedTitle>최근 검색어</SearchRelatedTitle>
                <SuggestSearchWordContainer
                  style={SearchSearchWordContainerStyle}
                >
                  {recentSearchWordList &&
                    recentSearchWordList
                      .slice(0)
                      .reverse()
                      .map((v, i) => (
                        <SearchQueryElement
                          key={i}
                          searchQueryWord={v.name}
                          onClickSearchQueryItem={() => {
                            onNavigate(v.name);
                          }}
                        >
                          <RecentDeleteButtonWrap
                            onClick={() => onClickDeleteSearchWord(v.name)}
                          >
                            <SearchWordDeleteButtonIcon />
                          </RecentDeleteButtonWrap>
                        </SearchQueryElement>
                      ))}
                </SuggestSearchWordContainer>
              </>
            )}
            {recentSearchWordList.length <= 0 && (
              <NotSuggestTitle>
                관심 있는 태그나 키워드를 검색해보세요.
              </NotSuggestTitle>
            )}
          </>
        ) : (
          <SuggestSearchWordContainer>
            {searchQueryRelationHashMap
              .get(searchTempWord)
              ?.map((value, index) => (
                <React.Fragment key={index}>
                  <SearchQueryElement
                    searchQueryWord={value}
                    onClickSearchQueryItem={() => {
                      onNavigate(value);
                    }}
                  />
                </React.Fragment>
              ))}
            {searchQueryRelationHashMap.get(searchTempWord) &&
              searchQueryRelationHashMap.get(searchTempWord)?.length === 0 && (
                <SearchQueryElement
                  searchQueryWord={`"${searchTempWord}" 검색`}
                  onClickSearchQueryItem={() => {
                    onNavigate(searchTempWord);
                  }}
                />
              )}
          </SuggestSearchWordContainer>
        )}
      </SearchRecentWordContainer>
    </SearchSuggestBodyContainer>
  );
};

const SearchSuggestBodyContainer = styled.div`
  position: fixed;
  height: calc(100% - ${theme.systemSize.header.height});
  top: ${theme.systemSize.header.height};
  width: 100%;

  background-color: ${({ theme }) => theme.mainColor.White};
  z-index: 20;
  overscroll-behavior: contain;
  overflow-y: auto;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.grey.Grey2};
    height: 500px;
    overflow: auto;
    padding-bottom: 20px;

    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
    z-index: 1000;
    width: 100%;
  }
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
  gap: 22px;
`;

const RecentDeleteButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

const NotSuggestTitle = styled.div`
  padding: 10px 0;
  font: ${({ theme }) => theme.fontSizes.Body2};
  font-size: 15px;
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default SearchSuggestBody;
