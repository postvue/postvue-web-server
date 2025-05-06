import { RECENTLY_SEARCH_WORD_LIST_LOCAL_STORAGE } from 'const/LocalStorageConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { getSearchQuery } from 'services/search/getSearchQuery';
import {
  SEARCH_POST_ROUTE_PATH,
  SEARCH_TAG_POST_ROUTE_PATH,
} from '../../../const/PathConst';
import {
  handleSearch,
  removeHashTag,
  startsWithHashTag,
} from '../../../global/util/SearchUtil';
import {
  isSearchInputActiveAtom,
  searchQueryRelationHashMapAtom,
  searchTempWordQueryAtom,
} from '../../../states/SearchPostAtom';
import SearchQueryElement from './SearchQueryElement';

interface SearchSuggestBodyProps {
  searchWord: string;
}

const SearchSuggestPostResultBody: React.FC<SearchSuggestBodyProps> = ({
  searchWord,
}) => {
  const navigate = useNavigate();

  const [searchQueryRelationHashMap, setSearchQueryRelationHashMap] =
    useRecoilState(searchQueryRelationHashMapAtom);

  const setIsSearchInputActive = useSetRecoilState(isSearchInputActiveAtom);
  const [searchTempWordQuery, setSearchTempWordQuery] = useRecoilState(
    searchTempWordQueryAtom,
  );

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

  const onFuncSearch = (searchWord: string) => {
    if (!isValidString(searchWord)) return;

    getSearchQuery(searchWord).then((value) => {
      const tempSearchQueryRelationHashMap = new Map(
        searchQueryRelationHashMap,
      );
      tempSearchQueryRelationHashMap.set(searchWord, value);
      setSearchQueryRelationHashMap(tempSearchQueryRelationHashMap);
    });
  };

  useEffect(() => {
    if (searchQueryRelationHashMap.get(searchTempWordQuery)) return;

    onFuncSearch(searchTempWordQuery);
  }, [searchTempWordQuery]);

  useEffect(() => {
    if (!isValidString(searchWord) || isValidString(searchTempWordQuery))
      return;

    setSearchTempWordQuery(searchWord);
  }, []);

  return (
    <>
      {searchQueryRelationHashMap
        .get(searchTempWordQuery)
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
      {searchQueryRelationHashMap.get(searchTempWordQuery) &&
        searchQueryRelationHashMap.get(searchTempWordQuery)?.length === 0 && (
          <SearchQueryElement
            searchQueryWord={`"${searchTempWordQuery}" 검색`}
            onClickSearchQueryItem={() => {
              onNavigate(searchTempWordQuery);
            }}
            SearchWordContainerStyle={{
              padding: '0px 21px',
            }}
          />
        )}
    </>
  );
};

export default SearchSuggestPostResultBody;
