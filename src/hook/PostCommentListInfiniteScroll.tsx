import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStatePostCommentListInfinite } from './queryhook/QueryStatePostCommentListInfinite';

interface PostCommentListInfiniteScrollProps {
  postId: string;
}

const PostCommentListInfiniteScroll: React.FC<
  PostCommentListInfiniteScrollProps
> = ({ postId }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStatePostCommentListInfinite(postId);

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

export default PostCommentListInfiniteScroll;
