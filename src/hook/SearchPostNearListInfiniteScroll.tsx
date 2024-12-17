import InViewComponent from 'components/common/container/InViewComponent';
import { GetSearchPostsRsp } from 'global/interface/search';
import { isValidSearchWordAndFilterKey } from 'global/util/SearchPostUtil';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateSearchPostNearListInfinite } from './queryhook/QueryStateSearchPostNearListInfinite';

interface RepostInfiniteScrollProps {
  searchQueryAndFilterKey: string;
  latitude: number;
  longitude: number;
}

export interface SearchPostQueryInterface {
  pages: GetSearchPostsRsp[];
  pageParams: unknown[];
}

const SearchPostNearListInfiniteScroll: React.FC<RepostInfiniteScrollProps> = ({
  searchQueryAndFilterKey,
  latitude,
  longitude,
}) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
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

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default SearchPostNearListInfiniteScroll;
