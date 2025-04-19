import React from 'react';

import styled from 'styled-components';

import { useRecoilValue } from 'recoil';
import {
  currentPositionSearchPostAtom,
  searchPostExploreFilterTabAtom,
  searchQueryAndFilterKeyAtom,
} from 'states/SearchPostAtom';
import {
  SEARCH_POST_LASTEST_QUERY_PARAM,
  SEARCH_POST_MY_NEAR_QUERY_PARAM,
  SEARCH_POST_POPULAR_QUERY_PARAM,
} from '../../../const/TabConfigConst';

import NoResultComponentInfinite from 'components/common/container/NoResultComponentInfitie';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateSearchPostNearListInfinite } from 'hook/queryhook/QueryStateSearchPostNearListInfinite';
import { QueryStateSearchPostPopularListInfinite } from 'hook/queryhook/QueryStateSearchPostPopularListInfinite';
import { QueryStateSearchPostRecentlyListInfinite } from 'hook/queryhook/QueryStateSearchPostRecentlyListInfinite';
import SearchPostNearListInfiniteScroll from 'hook/SearchPostNearListInfiniteScroll';
import SearchPostPopularListInfiniteScroll from 'hook/SearchPostPopularListInfiniteScroll';
import SearchPostRecentlyListInfiniteScroll from 'hook/SearchPostRecentlyListInfiniteScroll';
import SearchTagPostExploreFilter from './SearchTagPostExploreFilter';

const SearchTagPostBody: React.FC = () => {
  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const searchPostExploreFilterTab = useRecoilValue(
    searchPostExploreFilterTabAtom,
  );

  const currentPositionSearchPost = useRecoilValue(
    currentPositionSearchPostAtom,
  );

  const {
    data: searchPostPopularList,
    isFetched: isFetchedBySearchPostPopular,
    refetch: refetchByPostPopular,
  } = QueryStateSearchPostPopularListInfinite(
    searchQueryAndFilterKey,
    searchPostExploreFilterTab === SEARCH_POST_POPULAR_QUERY_PARAM,
  );

  const {
    data: searchPostNearList,
    isFetched: isFetchedBySearchPostNear,
    refetch: refetchByPostNear,
  } = QueryStateSearchPostNearListInfinite(
    searchQueryAndFilterKey,
    searchPostExploreFilterTab === SEARCH_POST_MY_NEAR_QUERY_PARAM,
    currentPositionSearchPost.latitude,
    currentPositionSearchPost.longitude,
  );

  const {
    data: searchPostRecentlyList,
    isFetched: isFetchedBySearchPostRecently,
  } = QueryStateSearchPostRecentlyListInfinite(
    searchQueryAndFilterKey,
    searchPostExploreFilterTab === SEARCH_POST_LASTEST_QUERY_PARAM,
  );

  const { windowWidth } = useWindowSize();

  return (
    <>
      <>
        {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM && (
          <SearchFilterContainer>
            <SearchTagPostExploreFilter />
          </SearchFilterContainer>
        )}

        <SearchTagPostBodyContinaer>
          <SearchPostContainer>
            {searchPostExploreFilterTab === SEARCH_POST_POPULAR_QUERY_PARAM && (
              <>
                {isFetchedBySearchPostPopular && (
                  <>
                    {!!searchPostPopularList &&
                    searchPostPopularList.pages.flatMap(
                      (value) => value.snsPostRspList,
                    ).length > 0 ? (
                      <SnsPostMasonryLayout
                        snsPostList={searchPostPopularList.pages.flatMap(
                          (page) => page.snsPostRspList.map((v) => v),
                        )}
                      />
                    ) : (
                      <NoResultComponentInfinite />
                    )}
                  </>
                )}
                <SearchPostPopularListInfiniteScroll
                  searchQueryAndFilterKey={searchQueryAndFilterKey}
                />
              </>
            )}
            {searchPostExploreFilterTab === SEARCH_POST_LASTEST_QUERY_PARAM && (
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
                      <NoResultComponentInfinite />
                    )}
                  </>
                )}
                <SearchPostRecentlyListInfiniteScroll
                  searchQueryAndFilterKey={searchQueryAndFilterKey}
                />
              </>
            )}
            {searchPostExploreFilterTab === SEARCH_POST_MY_NEAR_QUERY_PARAM && (
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
                      <NoResultComponentInfinite />
                    )}
                  </>
                )}
                {!!currentPositionSearchPost.latitude &&
                  !!currentPositionSearchPost.longitude && (
                    <SearchPostNearListInfiniteScroll
                      searchQueryAndFilterKey={searchQueryAndFilterKey}
                      latitude={currentPositionSearchPost.latitude}
                      longitude={currentPositionSearchPost.longitude}
                    />
                  )}
              </>
            )}
          </SearchPostContainer>
        </SearchTagPostBodyContinaer>
      </>
    </>
  );
};

const SearchTagPostBodyContinaer = styled.div`
  height: 100%;
  min-height: 100dvh;
`;

const SearchFilterContainer = styled.div`
  position: fixed;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.widthByPc};
  }
  z-index: 10;
  width: 100%;

  background-color: ${({ theme }) => theme.mainColor.White};
  height: ${({ theme }) => theme.systemSize.header.height};

  display: flex;
  justify-content: space-between;
`;

const SearchPostContainer = styled.div`
  margin-top: ${({ theme }) => theme.systemSize.header.heightNumber}px;
`;

export default SearchTagPostBody;
