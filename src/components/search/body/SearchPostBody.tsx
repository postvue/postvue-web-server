import React from 'react';

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

import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateSearchPostNearListInfinite } from 'hook/queryhook/QueryStateSearchPostNearListInfinite';
import { QueryStateSearchPostPopularListInfinite } from 'hook/queryhook/QueryStateSearchPostPopularListInfinite';
import { QueryStateSearchPostRecentlyListInfinite } from 'hook/queryhook/QueryStateSearchPostRecentlyListInfinite';
import SearchSubPostBody from './SearchPostSubBody';

const SearchPostBody: React.FC = () => {
  const searchQueryAndFilterKey = useRecoilValue(searchQueryAndFilterKeyAtom);

  const searchPostExploreFilterTab = useRecoilValue(
    searchPostExploreFilterTabAtom,
  );

  const currentPositionSearchPost = useRecoilValue(
    currentPositionSearchPostAtom,
  );

  const { refetch: refetchByPostPopular } =
    QueryStateSearchPostPopularListInfinite(
      searchQueryAndFilterKey,
      searchPostExploreFilterTab === SEARCH_POST_POPULAR_QUERY_PARAM,
    );

  const { refetch: refetchByPostNear } = QueryStateSearchPostNearListInfinite(
    searchQueryAndFilterKey,
    searchPostExploreFilterTab === SEARCH_POST_MY_NEAR_QUERY_PARAM,
    currentPositionSearchPost.latitude,
    currentPositionSearchPost.longitude,
  );

  const { refetch: refetchByRecently } =
    QueryStateSearchPostRecentlyListInfinite(
      searchQueryAndFilterKey,
      searchPostExploreFilterTab === SEARCH_POST_LASTEST_QUERY_PARAM,
    );

  const { windowWidth } = useWindowSize();

  return (
    <>
      <SearchSubPostBody />
    </>
  );
};

export default SearchPostBody;
