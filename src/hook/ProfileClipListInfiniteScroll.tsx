import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GetProfilePostListRsp } from 'services/profile/getProfilePostList';
import styled from 'styled-components';
import { QueryStateProfileClipListInfinite } from './queryhook/QueryStateProfileClipListInfinite';

export interface SearchPostQueryInterface {
  pages: GetProfilePostListRsp[];
  pageParams: unknown[];
}

const ProfileClipListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateProfileClipListInfinite();

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

export default ProfileClipListInfiniteScroll;
