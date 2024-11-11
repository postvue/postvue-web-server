import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateProfileScrap } from './queryhook/QueryStateProfileScrap';

interface ProfileScrapInfiniteScrollBetaProps {
  scrapId: string;
}

const ProfileScrapInfiniteScroll: React.FC<
  ProfileScrapInfiniteScrollBetaProps
> = ({ scrapId }) => {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateProfileScrap(scrapId);

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

export default ProfileScrapInfiniteScroll;
