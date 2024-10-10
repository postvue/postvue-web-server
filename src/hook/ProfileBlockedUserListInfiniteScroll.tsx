import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateProfileBlockedUserList } from './queryhook/QueryStateProfileBlockedUserList';

const ProfileBlockedUserListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateProfileBlockedUserList();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer>
      <div ref={ref}> 보인다.</div>
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default ProfileBlockedUserListInfiniteScroll;
