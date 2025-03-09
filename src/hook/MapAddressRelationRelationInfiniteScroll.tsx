import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateMapAddressRelationInfinite } from './queryhook/QueryStateMapAddressRelationInfinite';

interface MapAddressRelationListInfiniteScrollProps {
  srchQry: string;
  latitude?: number;
  longitude?: number;
}

const MapAddressRelationListInfiniteScroll: React.FC<
  MapAddressRelationListInfiniteScrollProps
> = ({ srchQry, latitude, longitude }) => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateMapAddressRelationInfinite(srchQry, latitude, longitude);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      data &&
      data.pages[0].length < 0
    ) {
      fetchNextPage();
    }
  }, [data, hasNextPage]);

  return (
    <ScrollBottomContainer ref={ref}>
      <InViewComponent
        hasLoadingIcon={
          (data ? data?.pages[0].length > 5 : false) && hasNextPage
        }
      />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default MapAddressRelationListInfiniteScroll;
