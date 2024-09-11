import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { SEARCH_PATH } from 'const/PathConst';
import { SEARCH_POST_FILTER_QUERY_PARAM } from 'const/QueryParamConst';
import { isValidString } from 'global/util/\bValidUtil';
import SearchPostListInfiniteScroll from 'hook/SearchPostListInfiniteScroll';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  searchQueryAndFilterKeyAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import {
  SEARCH_POST_LASTEST_FILTER_ID,
  SEARCH_POST_LASTEST_FILTER_NAME,
  SEARCH_POST_LASTEST_QUERY_PARAM,
  SEARCH_POST_MY_NEAR_FILTER_ID,
  SEARCH_POST_MY_NEAR_FILTER_NAME,
  SEARCH_POST_MY_NEAR_QUERY_PARAM,
  SEARCH_POST_POPULAR_FILTER_ID,
  SEARCH_POST_POPULAR_FILTER_NAME,
  SEARCH_POST_POPULAR_QUERY_PARAM,
} from '../../../const/TabConfigConst';
import theme from '../../../styles/theme';

const SearchPostBody: React.FC = () => {
  // navigate 객체
  const navigate = useNavigate();

  const searchWord = useRecoilValue(searchWordAtom);

  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const searchPostTabList = [
    {
      tabId: SEARCH_POST_POPULAR_FILTER_ID,
      tabName: SEARCH_POST_POPULAR_FILTER_NAME,
      queryParam: SEARCH_POST_POPULAR_QUERY_PARAM,
    },
    {
      tabId: SEARCH_POST_LASTEST_FILTER_ID,
      tabName: SEARCH_POST_LASTEST_FILTER_NAME,
      queryParam: SEARCH_POST_LASTEST_QUERY_PARAM,
    },
    {
      tabId: SEARCH_POST_MY_NEAR_FILTER_ID,
      tabName: SEARCH_POST_MY_NEAR_FILTER_NAME,
      queryParam: SEARCH_POST_MY_NEAR_QUERY_PARAM,
    },
  ];

  const [queryParam] = useSearchParams();
  const [searchPostFilterTab, setSearchPostFilterTab] = useState<string>(
    searchPostTabList[0].queryParam,
  );

  useEffect(() => {
    setSearchPostFilterTab(
      queryParam.get(SEARCH_POST_FILTER_QUERY_PARAM) ||
        searchPostTabList[0].queryParam,
    );
  }, [queryParam]);

  return (
    <SearchPostBodyContinaer>
      <SearchFilterContainer>
        <SearchFilterWrap>
          {searchPostTabList.map((v, i) => (
            <SearchFilterItem
              key={v.tabId}
              className={
                searchPostFilterTab === v.queryParam ? ACTIVE_CLASS_NAME : ''
              }
              onClick={() => {
                setSearchPostFilterTab(v.queryParam);
                if (
                  isValidString(searchWord) &&
                  searchPostFilterTab !== v.queryParam
                ) {
                  let searchResultPath = `${SEARCH_PATH}/${searchWord}`;
                  if (v.tabId !== SEARCH_POST_POPULAR_FILTER_ID) {
                    searchResultPath += `?${SEARCH_POST_FILTER_QUERY_PARAM}=${v.queryParam}`;
                  }
                  navigate(searchResultPath);
                }
              }}
            >
              {v.tabName}
            </SearchFilterItem>
          ))}
        </SearchFilterWrap>
      </SearchFilterContainer>
      <SearchPostContainer>
        <SearchPostListInfiniteScroll
          searchQueryAndFilterKey={searchQueryAndFilterKey}
        />
      </SearchPostContainer>
    </SearchPostBodyContinaer>
  );
};

const SearchPostBodyContinaer = styled.div`
  margin-top: ${theme.systemSize.header.height};
`;

const SearchFilterWrap = styled.div`
  padding: 12px 6px 6px 6px;
  display: flex;
  gap: 6px;
`;

const SearchFilterContainer = styled.div`
  position: fixed;
  z-index: 10;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  background-color: ${({ theme }) => theme.mainColor.White};
`;

const SearchPostContainer = styled.div`
  padding-top: 60px;
`;

const SearchFilterItem = styled.div`
  padding: 5px 12px;
  border-radius: 40px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  font: ${({ theme }) => theme.fontSizes.Body2};
  cursor: pointer;

  &.${ACTIVE_CLASS_NAME} {
    border-color: ${({ theme }) => theme.mainColor.Blue};
    color: ${({ theme }) => theme.mainColor.Blue};
  }
`;

export default SearchPostBody;
