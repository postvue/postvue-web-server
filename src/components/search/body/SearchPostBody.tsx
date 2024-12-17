import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { SEARCH_POST_PATH } from 'const/PathConst';
import { SEARCH_POST_FILTER_QUERY_PARAM } from 'const/QueryParamConst';
import { isValidString } from 'global/util/ValidUtil';
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

import NoResultComponent from 'components/common/container/NoResultComponent';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { getCurrentPositionAsync } from 'global/util/PositionUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateSearchPostNearListInfinite } from 'hook/queryhook/QueryStateSearchPostNearListInfinite';
import { QueryStateSearchPostPopularListInfinite } from 'hook/queryhook/QueryStateSearchPostPopularListInfinite';
import { QueryStateSearchPostRecentlyListInfinite } from 'hook/queryhook/QueryStateSearchPostRecentlyListInfinite';
import SearchPostNearListInfiniteScroll from 'hook/SearchPostNearListInfiniteScroll';
import SearchPostPopularListInfiniteScroll from 'hook/SearchPostPopularListInfiniteScroll';
import SearchPostRecentlyListInfiniteScroll from 'hook/SearchPostRecentlyListInfiniteScroll';
import SearchFilterButton from './SearchFilterButton';

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
  const [searchPostFilterTab, setSearchPostFilterTab] = useState<string>('');

  const [currentPosition, setCurrentPosition] = useState<{
    latitude?: number;
    longitude?: number;
  }>({
    latitude: undefined,
    longitude: undefined,
  });

  const {
    data: searchPostPopularList,
    isFetched: isFetchedBySearchPostPopular,
  } = QueryStateSearchPostPopularListInfinite(
    searchQueryAndFilterKey,
    searchPostFilterTab === SEARCH_POST_POPULAR_QUERY_PARAM,
  );

  const { data: searchPostNearList, isFetched: isFetchedBySearchPostNear } =
    QueryStateSearchPostNearListInfinite(
      searchQueryAndFilterKey,
      searchPostFilterTab === SEARCH_POST_MY_NEAR_QUERY_PARAM,
      currentPosition.latitude,
      currentPosition.longitude,
    );

  const {
    data: searchPostRecentlyList,
    isFetched: isFetchedBySearchPostRecently,
  } = QueryStateSearchPostRecentlyListInfinite(
    searchQueryAndFilterKey,
    searchPostFilterTab === SEARCH_POST_LASTEST_QUERY_PARAM,
  );

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    setSearchPostFilterTab(
      queryParam.get(SEARCH_POST_FILTER_QUERY_PARAM) ||
        searchPostTabList[0].queryParam,
    );
    if (
      queryParam.get(SEARCH_POST_FILTER_QUERY_PARAM) ===
      SEARCH_POST_MY_NEAR_QUERY_PARAM
    ) {
      getCurrentPositionAsync().then((value) => {
        setCurrentPosition({
          latitude: value.latitude,
          longitude: value.longitude,
        });
      });
    }
  }, [queryParam]);

  return (
    <>
      <SearchFilterContainer>
        <SearchFilterWrap>
          {searchPostTabList.map((v) => (
            <BorderCircleButton
              key={v.tabId}
              contentText={v.tabName}
              BorderCircleButtonStyle={{ fontSize: '15px' }}
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
        {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM && <SearchFilterButton />}
      </SearchFilterContainer>
      <SearchPostBodyContinaer>
        <SearchPostContainer>
          {searchPostFilterTab === SEARCH_POST_POPULAR_QUERY_PARAM && (
            <>
              {isFetchedBySearchPostPopular && (
                <>
                  {!!searchPostPopularList &&
                  searchPostPopularList.pages.flatMap(
                    (value) => value.snsPostRspList,
                  ).length > 0 ? (
                    <SnsPostMasonryLayout
                      snsPostList={searchPostPopularList.pages.flatMap((page) =>
                        page.snsPostRspList.map((v) => v),
                      )}
                    />
                  ) : (
                    <NoResultComponent />
                  )}
                </>
              )}
              <SearchPostPopularListInfiniteScroll
                searchQueryAndFilterKey={searchQueryAndFilterKey}
              />
            </>
          )}
          {searchPostFilterTab === SEARCH_POST_LASTEST_QUERY_PARAM && (
            <>
              {isFetchedBySearchPostRecently && (
                <>
                  {!!searchPostRecentlyList &&
                  searchPostRecentlyList.pages.flatMap(
                    (value) => value.snsPostRspList,
                  ).length > 0 ? (
                    <SnsPostMasonryLayout
                      snsPostList={searchPostRecentlyList.pages.flatMap(
                        (page) => page.snsPostRspList.map((v) => v),
                      )}
                    />
                  ) : (
                    <NoResultComponent />
                  )}
                </>
              )}
              <SearchPostRecentlyListInfiniteScroll
                searchQueryAndFilterKey={searchQueryAndFilterKey}
              />
            </>
          )}
          {searchPostFilterTab === SEARCH_POST_MY_NEAR_QUERY_PARAM && (
            <>
              {isFetchedBySearchPostNear && (
                <>
                  {!!searchPostNearList &&
                  searchPostNearList.pages.flatMap(
                    (value) => value.snsPostRspList,
                  ).length > 0 ? (
                    <SnsPostMasonryLayout
                      snsPostList={searchPostNearList.pages.flatMap((page) =>
                        page.snsPostRspList.map((v) => v),
                      )}
                    />
                  ) : (
                    <NoResultComponent />
                  )}
                </>
              )}
              {!!currentPosition.latitude && !!currentPosition.longitude && (
                <SearchPostNearListInfiniteScroll
                  searchQueryAndFilterKey={searchQueryAndFilterKey}
                  latitude={currentPosition.latitude}
                  longitude={currentPosition.longitude}
                />
              )}
            </>
          )}
        </SearchPostContainer>
      </SearchPostBodyContinaer>
    </>
  );
};

const SearchPostBodyContinaer = styled.div`
  height: 100%;
`;

const SearchFilterWrap = styled.div`
  padding: 6px;
  display: flex;
  gap: 6px;
`;

const SearchFilterContainer = styled.div`
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
  }
  z-index: 10;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};
  background-color: ${({ theme }) => theme.mainColor.White};
  height: ${({ theme }) => theme.systemSize.header.height};

  display: flex;
  justify-content: space-between;
`;

const SearchPostContainer = styled.div`
  margin-top: ${({ theme }) => theme.systemSize.header.heightNumber * 1}px;
`;

export default SearchPostBody;
