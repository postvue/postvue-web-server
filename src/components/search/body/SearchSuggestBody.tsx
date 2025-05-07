import HomeFollowSubBody from 'components/home/body/HomeFollowSubBody';
import { RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE } from 'const/LocalStorageConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import {
  HOME_RECOMM_FOLLOW_SUB_TITLE,
  SEARCH_SUGGEST_PROFILE_PHARSE_TEXT,
  SEARCH_SUGGEST_SCRAP_PHARSE_TEXT,
} from 'const/SystemPhraseConst';
import {
  SEARCH_PAGE_PROFILE_TAB_ID,
  SEARCH_PAGE_PROFILE_TAB_NAME,
  SEARCH_PAGE_SCRAP_TAB_ID,
  SEARCH_PAGE_SCRAP_TAB_NAME,
} from 'const/TabConfigConst';
import { isMobile } from 'global/util/SystemUtil';
import { QueryStateFollowForMeListInfinite } from 'hook/queryhook/QueryStateFollowForMeListInfinite';
import React, { useEffect, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import styled from 'styled-components';
import { lock, unlock } from 'tua-body-scroll-lock';
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
import {
  isSearchInputActiveAtom,
  searchTabInfoAtom,
  searchTempWordAtom,
  searchTempWordQueryAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';
import theme from '../../../styles/theme';
import RecommScrapBody from './RecommScrapBody';
import SearchRecentListElement from './SearchRecentlyListElement';
import SearchSuggestResultBody from './SearchSuggestResultBody';

interface SearchSuggestBodyProps {
  SearchSuggestBodyContiainerStyle?: React.CSSProperties;
  SearchSuggestBodyWrapStyle?: React.CSSProperties;
  SearchSearchWordContainerStyle?: React.CSSProperties;
  suggestBodyRef?: React.RefObject<HTMLDivElement>;
  loading: boolean;
}

const SearchSuggestBody: React.FC<SearchSuggestBodyProps> = ({
  SearchSuggestBodyContiainerStyle,
  SearchSuggestBodyWrapStyle,
  SearchSearchWordContainerStyle,
  suggestBodyRef,
  loading,
}) => {
  const navigate = useNavigate();

  const [recentSearchWordList, setRecentSearchWordList] = useState<
    SearchRecentKeywordInterface[]
  >([]);

  const setIsSearchInputActive = useSetRecoilState(isSearchInputActiveAtom);

  const searchWord = useRecoilValue(searchWordAtom);
  const searchTempWord = useRecoilValue(searchTempWordAtom);
  const searchTempWordQuery = useRecoilValue(searchTempWordQueryAtom);

  const onClickDeleteSearchWord = (searchWord: string) => {
    const deletedSearchRecentSearchWordList: SearchRecentKeywordInterface[] =
      deleteRecentlyKeyword(
        RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE,
        searchWord,
      );

    setRecentSearchWordList(deletedSearchRecentSearchWordList);
  };

  const SearchRecentListRef = useRef<HTMLDivElement>(null);

  const resetSearchTempWordQuery = useResetRecoilState(searchTempWordQueryAtom);

  useEffect(() => {
    setRecentSearchWordList(
      getRecentSearchWordList(RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE),
    );

    return () => {
      setRecentSearchWordList([]);
      resetSearchTempWordQuery();
      unlock([], {
        useGlobalLockState: true,
      });
    };
  }, []);

  useEffect(() => {
    if (suggestBodyRef?.current && SearchRecentListRef.current) {
      lock([suggestBodyRef.current, SearchRecentListRef.current]);
    }

    return () => {
      unlock([], {
        useGlobalLockState: true,
      });
    };
  }, [suggestBodyRef?.current, SearchRecentListRef.current]);

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

  const [searchTabInfo, setSearchTabInfo] = useRecoilState(searchTabInfoAtom);
  const resetSearchTabInfo = useResetRecoilState(searchTabInfoAtom);

  const searchTabList = [
    {
      tabId: SEARCH_PAGE_PROFILE_TAB_ID,
      tabName: SEARCH_PAGE_PROFILE_TAB_NAME,
    },
    {
      tabId: SEARCH_PAGE_SCRAP_TAB_ID,
      tabName: SEARCH_PAGE_SCRAP_TAB_NAME,
    },
  ];

  const { data: followForMeList } = QueryStateFollowForMeListInfinite();

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (!suggestBodyRef) return;
    const scrollTarget = suggestBodyRef.current;

    if (!scrollTarget) return;

    const onScroll = () => {
      const currentScrollY = scrollTarget.scrollTop;

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 50) {
        // 아래로 스크롤
        setShowHeader(false);
      } else {
        // 위로 스크롤
        setShowHeader(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    scrollTarget.addEventListener('scroll', onScroll);

    return () => {
      scrollTarget.removeEventListener('scroll', onScroll);
      resetSearchTabInfo();
    };
  }, []);

  return (
    <SearchSuggestBodyContainer
      style={SearchSuggestBodyContiainerStyle}
      ref={suggestBodyRef}
    >
      <div>
        {isMobile() && (
          <SearchTypeTabContainer $showHeader={showHeader}>
            {searchTabList.map((v, i) => (
              <SearchTypeTabItemWrap
                key={i}
                onClick={() => {
                  setSearchTabInfo((prev) => ({ ...prev, tabId: v.tabId }));
                }}
              >
                <SearchTypeTabItem>{v.tabName}</SearchTypeTabItem>
                {v.tabId === searchTabInfo.tabId && <TabStickBarComponent />}
              </SearchTypeTabItemWrap>
            ))}
          </SearchTypeTabContainer>
        )}
        <SearchRecentWordContainer style={SearchSuggestBodyWrapStyle}>
          {!isValidString(searchTempWord) ? (
            <>
              {recentSearchWordList.length > 0 && (
                <>
                  <SearchRelatedTitle>최근 검색어</SearchRelatedTitle>
                  <SuggestSearchWordContainer
                    style={SearchSearchWordContainerStyle}
                  >
                    {/* {recentSearchWordList &&
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
                        ))} */}
                    <SearchRecentListElement
                      searchRecentKeyworList={recentSearchWordList
                        .slice(0)
                        .reverse()}
                      onClickFunc={(searchWord: string) => {
                        onNavigate(searchWord);
                      }}
                      SearchRecentListRef={SearchRecentListRef}
                      onDeleteSearchWord={(searchWord: string) =>
                        onClickDeleteSearchWord(searchWord)
                      }
                    />
                  </SuggestSearchWordContainer>
                </>
              )}

              {isMobile() && (
                <>
                  {searchTabInfo.tabId === SEARCH_PAGE_PROFILE_TAB_ID ? (
                    <HomeFollowSubBody
                      mainTitle={SEARCH_SUGGEST_PROFILE_PHARSE_TEXT}
                      subTitle={HOME_RECOMM_FOLLOW_SUB_TITLE}
                    />
                  ) : (
                    <>
                      <NotSuggestTitle>
                        {SEARCH_SUGGEST_SCRAP_PHARSE_TEXT}
                      </NotSuggestTitle>
                      <RecommScrapBody />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {!loading && (
                <SearchSuggestResultBody
                  searchTempWordQuery={searchTempWordQuery}
                  searchWord={searchWord}
                  searchTabInfo={searchTabInfo}
                />
              )}
            </>
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

const SearchTypeTabContainer = styled.div<{ $showHeader: boolean }>`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.grey.Grey1};
  position: fixed;
  top: calc(${theme.systemSize.header.height} + env(safe-area-inset-top));
  width: 100%;
  max-width: ${theme.systemSize.appDisplaySize.maxWidth};
  z-index: 100;
  background-color: white;
  transform: ${(props) =>
    props.$showHeader ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.2s ease-in-out;
`;

const SearchTypeTabItemWrap = styled.div`
  width: 100%;
  text-align: center;
`;

const SearchTypeTabItem = styled.div`
  text-align: center;
  padding: 10px;
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey8};
  padding-bottom: 12px;
  padding: 0 21px 10px 21px;
`;

const SearchRecentWordContainer = styled.div`
  margin: calc(${theme.systemSize.header.height} + 10px) 0 41px 0;
`;

const SuggestSearchWordContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

const NotSuggestTitle = styled.div`
  padding: 10px 21px;
  font: ${({ theme }) => theme.fontSizes.Headline1};
`;

const TabStickBarComponent = styled.div`
  background-color: ${({ theme }) => theme.mainColor.Black};
  height: 1.5px;
  border-radius: 5px;
  margin-top: 1px;
`;

export default SearchSuggestBody;
