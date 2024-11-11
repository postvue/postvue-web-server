import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStatePostCommentReplyListInfinite } from './queryhook/QueryStatePostCommentReplyListInfinite';

interface PostCommentReplyListInfiniteScrollProps {
  postId: string;
  commentId: string;
}

const PostCommentReplyListInfiniteScroll: React.FC<
  PostCommentReplyListInfiniteScrollProps
> = ({ postId, commentId }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStatePostCommentReplyListInfinite(postId, commentId);

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

export default PostCommentReplyListInfiniteScroll;
