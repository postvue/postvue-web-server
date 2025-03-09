import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStatePostRelationListInfinite } from './queryhook/QueryStatePostRelationListInfinite';

interface ProfilePostListInfiniteScrollProps {
  postId: string;
  searchType?: string;
}

const PostRelationListInfiniteScroll: React.FC<
  ProfilePostListInfiniteScrollProps
> = ({ postId, searchType }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    QueryStatePostRelationListInfinite(postId, searchType);

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
  margin: 0px auto;
`;

export default PostRelationListInfiniteScroll;
