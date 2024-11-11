import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GetProfilePostListRsp } from 'services/profile/getProfilePostList';
import styled from 'styled-components';
import { QueryStateFollowForMeListInfinite } from './queryhook/QueryStateFollowForMeListInfinite';

export interface SearchPostQueryInterface {
  pages: GetProfilePostListRsp[];
  pageParams: unknown[];
}

const FollowForMeListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateFollowForMeListInfinite();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default FollowForMeListInfiniteScroll;
