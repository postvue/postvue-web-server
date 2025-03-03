import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStatePostMapPostInfinite } from './queryhook/QueryStatePostMapPostInfinite';

interface MapPostListInfiniteScrolProps {
  searchWord: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}

const MapPostListInfiniteScroll: React.FC<MapPostListInfiniteScrolProps> = ({
  searchWord,
  latitude,
  longitude,
  isActive,
  startDate,
  endDate,
}) => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    QueryStatePostMapPostInfinite(
      searchWord,
      latitude,
      longitude,
      isActive && !!latitude && !!longitude,
      startDate,
      endDate,
    );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

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

export default MapPostListInfiniteScroll;
