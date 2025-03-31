import InViewComponent from 'components/common/container/InViewComponent';
import { isValidSearchWordAndFilterKey } from 'global/util/SearchPostUtil';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateSearchPostListInfinite } from './queryhook/QueryStateSearchPostListInfinite';

interface SearchPostListInfiniteScrollProps {
  searchQueryAndFilterKey: string;
}

const SearchPostListInfiniteScroll: React.FC<
  SearchPostListInfiniteScrollProps
> = ({ searchQueryAndFilterKey }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    QueryStateSearchPostListInfinite(searchQueryAndFilterKey);

  useEffect(() => {
    if (
      isValidSearchWordAndFilterKey(searchQueryAndFilterKey) &&
      inView &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent
        hasLoadingIcon={
          (data ? data?.pages[0].snsPostRspList.length > 5 : false) &&
          hasNextPage
        }
      />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostListInfiniteScroll;
