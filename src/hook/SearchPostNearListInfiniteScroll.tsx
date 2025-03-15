import InViewComponent from 'components/common/container/InViewComponent';
import { isValidSearchWordAndFilterKey } from 'global/util/SearchPostUtil';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateSearchPostNearListInfinite } from './queryhook/QueryStateSearchPostNearListInfinite';

interface SearchPostNearListInfiniteScrollProps {
  searchQueryAndFilterKey: string;
  latitude: number;
  longitude: number;
}

const SearchPostNearListInfiniteScroll: React.FC<
  SearchPostNearListInfiniteScrollProps
> = ({ searchQueryAndFilterKey, latitude, longitude }) => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateSearchPostNearListInfinite(
      searchQueryAndFilterKey,
      !!latitude && !!longitude,
      latitude,
      longitude,
    );

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

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      data &&
      data.pages[0].snsPostRspList.length < 10
    ) {
      fetchNextPage();
    }
  }, [data, hasNextPage]);

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent hasLoadingIcon={hasNextPage} hasTermComponent={true} />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostNearListInfiniteScroll;
