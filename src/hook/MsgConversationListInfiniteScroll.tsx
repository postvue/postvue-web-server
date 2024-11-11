import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateMsgConversationListInfinite } from './queryhook/QueryStateMsgConversationListInfinite';

interface MsgConversationListInfiniteScrollProps {
  targetUserId: string;
}

const MsgConversationListInfiniteScroll: React.FC<
  MsgConversationListInfiniteScrollProps
> = ({ targetUserId }) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateMsgConversationListInfinite(targetUserId);

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

export default MsgConversationListInfiniteScroll;
