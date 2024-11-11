import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GetRecommPostRelationRsp } from 'services/recomm/getRecommPostRelation';
import styled from 'styled-components';
import { QueryStatePostRelationListInfinite } from './queryhook/QueryStatePostRelationListInfinite';

interface ProfilePostListInfiniteScrollProps {
  postId: string;
}

export interface ProfilePostRelationQueryInterface {
  pages: GetRecommPostRelationRsp[];
  pageParams: unknown[];
}

const PostRelationListInfiniteScroll: React.FC<
  ProfilePostListInfiniteScrollProps
> = ({ postId }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStatePostRelationListInfinite(postId);

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
  margin: 0px auto;
`;

export default PostRelationListInfiniteScroll;
