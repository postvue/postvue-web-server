import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateFollowForMeListInfinite } from './queryhook/QueryStateFollowForMeListInfinite';

const FollowForMeListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateFollowForMeListInfinite();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

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

export default FollowForMeListInfiniteScroll;
