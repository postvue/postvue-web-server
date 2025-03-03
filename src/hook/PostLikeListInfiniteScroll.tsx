import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStatePostLikeListInfinite } from './queryhook/QueryStatePostLikeListInfinite';

interface PostLikeListInfiniteScrollProps {
  postId: string;
}

const PostLikeListInfiniteScroll: React.FC<PostLikeListInfiniteScrollProps> = ({
  postId,
}) => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStatePostLikeListInfinite(postId);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      data &&
      data.pages[0].snsPostLikeGetRspList.length < 10
    ) {
      fetchNextPage();
    }
  }, [data, hasNextPage]);

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent
        hasLoadingIcon={
          (data ? data?.pages[0].snsPostLikeGetRspList.length > 5 : false) &&
          hasNextPage
        }
      />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default PostLikeListInfiniteScroll;
