import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateTasteForMeListInfinite } from './queryhook/QueryStateTasteForMeListInfinite';

const TasteForMeListInfiniteScroll: React.FC = () => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateTasteForMeListInfinite();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <PostRelationWrap ref={ref}>
      <InViewComponent hasLoadingIcon={hasNextPage} />
    </PostRelationWrap>
  );
};

const PostRelationWrap = styled.div`
  margin: 0 auto;
`;

export default TasteForMeListInfiniteScroll;
