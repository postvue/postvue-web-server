import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateSearchProfileUserListInfinite } from './queryhook/QueryStateSearchProfileUserListInfinite';

interface ProfileSearchUserListInfiniteScrollProps {
  username: string;
}

const ProfileSearchUserListInfiniteScroll: React.FC<
  ProfileSearchUserListInfiniteScrollProps
> = ({ username }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateSearchProfileUserListInfinite(username);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <PostRelationWrap ref={ref}>
      <InViewComponent />
    </PostRelationWrap>
  );
};

const PostRelationWrap = styled.div`
  margin: 0 auto;
`;

export default ProfileSearchUserListInfiniteScroll;
