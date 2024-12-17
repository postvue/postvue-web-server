import InViewComponent from 'components/common/container/InViewComponent';
import { GetSearchPostsRsp } from 'global/interface/search';
import { isValidSearchWordAndFilterKey } from 'global/util/SearchPostUtil';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateSearchPostRecentlyListInfinite } from './queryhook/QueryStateSearchPostRecentlyListInfinite';

interface RepostInfiniteScrollProps {
  searchQueryAndFilterKey: string;
}

export interface SearchPostQueryInterface {
  pages: GetSearchPostsRsp[];
  pageParams: unknown[];
}

const SearchPostRecentlyListInfiniteScroll: React.FC<
  RepostInfiniteScrollProps
> = ({ searchQueryAndFilterKey }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateSearchPostRecentlyListInfinite(searchQueryAndFilterKey, true);

  useEffect(() => {
    if (
      isValidSearchWordAndFilterKey(searchQueryAndFilterKey) &&
      inView &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostRecentlyListInfiniteScroll;
