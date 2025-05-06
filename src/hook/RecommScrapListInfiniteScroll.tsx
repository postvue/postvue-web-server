import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateRecommScrapListInfinite } from './queryhook/QueryStateRecommScrapListInfinite';

interface RecommScrapListInfiniteScrollProps {
  isActive?: boolean;
}

const RecommScrapListInfiniteScroll: React.FC<
  RecommScrapListInfiniteScrollProps
> = ({ isActive = true }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    QueryStateRecommScrapListInfinite(isActive);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <PostRelationWrap ref={ref}>
      <InViewComponent
        hasLoadingIcon={
          (data ? data?.pages[0].length > 5 : false) && hasNextPage
        }
      />
    </PostRelationWrap>
  );
};

const PostRelationWrap = styled.div`
  margin: 0 auto;
`;

export default RecommScrapListInfiniteScroll;
