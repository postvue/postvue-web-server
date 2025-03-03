import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateProfileScrapList } from './queryhook/QueryStateProfileScrapList';

const ProfileScrapListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    QueryStateProfileScrapList();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent
        hasLoadingIcon={
          (data ? data?.pages[0].length > 5 : false) && hasNextPage
        }
      />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default ProfileScrapListInfiniteScroll;
