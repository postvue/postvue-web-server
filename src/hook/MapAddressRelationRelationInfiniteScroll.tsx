import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateMapAddressRelationInfinite } from './queryhook/QueryStateMapAddressRelationInfinite';

interface MapAddressRelationListInfiniteScrollProps {
  srchQry: string;
}

const MapAddressRelationListInfiniteScroll: React.FC<
  MapAddressRelationListInfiniteScrollProps
> = ({ srchQry }) => {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateMapAddressRelationInfinite(srchQry);

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

export default MapAddressRelationListInfiniteScroll;
