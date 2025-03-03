import InViewComponent from 'components/common/container/InViewComponent';
import { isValidSearchWordAndFilterKey } from 'global/util/SearchPostUtil';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateSearchPostPopularListInfinite } from './queryhook/QueryStateSearchPostPopularListInfinite';

interface SearchPostPopularListInfiniteScrollProps {
  searchQueryAndFilterKey: string;
}

const SearchPostPopularListInfiniteScroll: React.FC<
  SearchPostPopularListInfiniteScrollProps
> = ({ searchQueryAndFilterKey }) => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateSearchPostPopularListInfinite(searchQueryAndFilterKey, true);

  // 초기 개수가 적을 시, 이후 요청 하는 로직
  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      data &&
      data.pages[0].snsPostRspList.length < 5
    ) {
      fetchNextPage();
    }
  }, [data, hasNextPage]);

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
      <InViewComponent
        hasLoadingIcon={hasNextPage && !inView && !isFetchingNextPage}
      />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostPopularListInfiniteScroll;
