import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GetProfilePostListRsp } from 'services/profile/getProfilePostList';
import styled from 'styled-components';
import { QueryStateProfilePostList } from './queryhook/QueryStateProfilePostList';

interface ProfilePostListInfiniteScrollProps {
  username: string;
}

export interface SearchPostQueryInterface {
  pages: GetProfilePostListRsp[];
  pageParams: unknown[];
}

const ProfilePostListInfiniteScroll: React.FC<
  ProfilePostListInfiniteScrollProps
> = ({ username }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateProfilePostList(username);

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

export default ProfilePostListInfiniteScroll;
