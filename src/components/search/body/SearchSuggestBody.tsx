import { ReactComponent as SearchWordDeleteButtonIcon } from 'assets/images/icon/svg/SearchWordDeleteButtonIcon.svg';
import { RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE } from 'const/LocalStorageConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { SEARCH_INPUT_PHARSE_TEXT } from 'const/SystemPhraseConst';
import React, { useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  SEARCH_POST_ROUTE_PATH,
  SEARCH_TAG_POST_ROUTE_PATH,
} from '../../../const/PathConst';
import { SearchRecentKeywordInterface } from '../../../global/interface/localstorage/SearchInterface';
import {
  deleteRecentlyKeyword,
  getRecentSearchWordList,
  handleSearch,
  removeHashTag,
  startsWithHashTag,
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
    if (searchWord === word) {
      setIsSearchInputActive(false);
    } else {
      handleSearch(RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE, word);
      const data: RoutePushEventDateInterface = {
        isShowInitBottomNavBar: true,
      };
      if (startsWithHashTag(word)) {
        // stackRouterPush(
        //   navigate,
        //   `${SEARCH_TAG_POST_PATH}/${removeHashTag(word)}`,
        //   data,
        // );

        navigate(
          generatePath(SEARCH_TAG_POST_ROUTE_PATH, {
            search_word: removeHashTag(word),
          }),
        );
      } else {
        // stackRouterPush(navigate, `${SEARCH_POST_PATH}/${word}`, data);
        navigate(
          generatePath(SEARCH_POST_ROUTE_PATH, {
            search_word: word,
          }),
        );
      }

      setTimeout(() => {
        setIsSearchInputActive(false);
      }, 500);
    }
  };

  return (
    <SearchSuggestBodyContainer
      style={SearchSuggestBodyContiainerStyle}
      ref={suggestBodyRef}
    >
      <div>
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
                            SearchWordContainerStyle={{
                              padding: '0px 21px',
                            }}
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
                <NotSuggestTitle>{SEARCH_INPUT_PHARSE_TEXT}</NotSuggestTitle>
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
                      SearchWordContainerStyle={{
                        padding: '0px 21px',
                      }}
                    />
                  </React.Fragment>
                ))}
              {searchQueryRelationHashMap.get(searchTempWord) &&
                searchQueryRelationHashMap.get(searchTempWord)?.length ===
                  0 && (
                  <SearchQueryElement
                    searchQueryWord={`"${searchTempWord}" 검색`}
                    onClickSearchQueryItem={() => {
                      onNavigate(searchTempWord);
                    }}
                    SearchWordContainerStyle={{
                      padding: '0px 21px',
                    }}
                  />
                )}
            </SuggestSearchWordContainer>
          )}
        </SearchRecentWordContainer>
      </div>
    </SearchSuggestBodyContainer>
  );
};

const SearchSuggestBodyContainer = styled.div`
  position: fixed;
  height: calc(100% - ${theme.systemSize.header.height});
  top: ${theme.systemSize.header.height};
  width: 100%;
  z-index: 200;
  padding-top: env(safe-area-inset-top);

  background-color: ${({ theme }) => theme.mainColor.White};
  overscroll-behavior: contain;
  overflow-y: auto;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 20px;
    border: 1px solid ${theme.grey.Grey2};
    position: absolute;
    height: 500px;
    overflow: auto;
    padding-bottom: 20px;

    z-index: 1000;
    width: calc(100% - 2px);
    max-width: none;
  }
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  padding-bottom: 12px;
  padding: 0 21px 10px 21px;
`;

const SearchRecentWordContainer = styled.div`
  margin: 22px 0 41px 0;
`;

const SuggestSearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

const RecentDeleteButtonWrap = styled.div`
  display: flex;
  cursor: pointer;
  margin: auto 0;
`;

const NotSuggestTitle = styled.div`
  padding: 10px 21px;
  font: ${({ theme }) => theme.fontSizes.Body2};
  font-size: 15px;
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default SearchSuggestBody;
