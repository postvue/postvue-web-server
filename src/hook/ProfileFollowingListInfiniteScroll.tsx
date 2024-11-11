import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { QueryStateProfileFollowingListInfinite } from './queryhook/QueryStateProfileFollowingListInfinite';

interface ProfileFollowingListInfiniteScrollProps {
  username: string;
}

const ProfileFollowingListInfiniteScroll: React.FC<
  ProfileFollowingListInfiniteScrollProps
> = ({ username }) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateProfileFollowingListInfinite(username);
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

export default ProfileFollowingListInfiniteScroll;
