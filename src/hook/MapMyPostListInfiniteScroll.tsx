import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateMapMyPostList } from './queryhook/QueryStateMapMyPostList';

const MapMyPostListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateMapMyPostList();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      data &&
      data.pages[0].length < 10
    ) {
      fetchNextPage();
    }
  }, [data, hasNextPage]);

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent hasLoadingIcon={hasNextPage} />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default MapMyPostListInfiniteScroll;
