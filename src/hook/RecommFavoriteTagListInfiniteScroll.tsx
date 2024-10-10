import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateRecommFavoriteTagList } from './queryhook/QueryStateRecommFavoriteTagList';

const RecommFavoriteTagListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateRecommFavoriteTagList();

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

export default RecommFavoriteTagListInfiniteScroll;
