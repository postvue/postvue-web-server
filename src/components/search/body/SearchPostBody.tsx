import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { SEARCH_POST_PATH } from 'const/PathConst';
import { SEARCH_POST_FILTER_QUERY_PARAM } from 'const/QueryParamConst';
import { isValidString } from 'global/util/ValidUtil';
import { QueryStatePostSearchListInfinite } from 'hook/queryhook/QueryStatePostSearchListInfinite';
import SearchPostListInfiniteScroll from 'hook/SearchPostListInfiniteScroll';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isActiveSearchPostFilterPopupAtom,
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

import { ReactComponent as PostSearchFilterButtonIcon } from 'assets/images/icon/svg/post/PostSearchFilterButtonIcon.svg';

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

  const { data } = QueryStatePostSearchListInfinite(searchQueryAndFilterKey);

  const setIsActiveSearchPostFilterPopup = useSetRecoilState(
    isActiveSearchPostFilterPopupAtom,
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
            <BorderCircleButton
              key={v.tabId}
              contentText={v.tabName}
              className={
                searchPostFilterTab === v.queryParam ? ACTIVE_CLASS_NAME : ''
              }
              onClickFunc={() => {
                setSearchPostFilterTab(v.queryParam);
                if (
                  isValidString(searchWord) &&
                  searchPostFilterTab !== v.queryParam
                ) {
                  let searchResultPath = `${SEARCH_POST_PATH}/${searchWord}`;
                  if (v.tabId !== SEARCH_POST_POPULAR_FILTER_ID) {
                    searchResultPath += `?${SEARCH_POST_FILTER_QUERY_PARAM}=${v.queryParam}`;
                  }
                  navigate(searchResultPath, { replace: true });
                }
              }}
              deactiveBorderColor={theme.grey.Grey2}
              activeFontColor={theme.mainColor.Blue}
              activeBorderColor={theme.mainColor.Blue}
            />
          ))}
        </SearchFilterWrap>
        <SearchPostFilterButtonWrap
          onClick={() => setIsActiveSearchPostFilterPopup(true)}
        >
          <PostSearchFilterButtonIcon />
        </SearchPostFilterButtonWrap>
      </SearchFilterContainer>
      <SearchPostContainer>
        {data && (
          <SnsPostMasonryLayout
            snsPostList={data.pages.flatMap((page) =>
              page.snsPostRspList.map((v) => v),
            )}
          />
        )}
        <SearchPostListInfiniteScroll
          searchQueryAndFilterKey={searchQueryAndFilterKey}
        />
      </SearchPostContainer>
    </SearchPostBodyContinaer>
  );
};

const SearchPostBodyContinaer = styled.div``;

const SearchFilterWrap = styled.div`
  padding: 6px;
  display: flex;
  gap: 6px;
`;

const SearchFilterContainer = styled.div`
  position: sticky;
  z-index: 10;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};
  background-color: ${({ theme }) => theme.mainColor.White};

  display: flex;
  justify-content: space-between;
`;

const SearchPostContainer = styled.div`
  padding-top: 10px;
`;

const SearchPostFilterButtonWrap = styled.div`
  margin: auto 10px auto 0px;
  display: flex;
`;

export default SearchPostBody;
