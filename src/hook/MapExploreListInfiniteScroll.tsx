import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateMapExploreList } from './queryhook/QueryStateMapExploreList';

interface MapExploreListInfiniteScrollProps {
  latitude: number;
  longitude: number;
  nearFilter: string;
  startDate: string | null;
  endDate: string | null;
  MapExploreInfiniteScrollStyle?: React.CSSProperties;
}

const MapExploreListInfiniteScroll: React.FC<
  MapExploreListInfiniteScrollProps
> = ({
  latitude,
  longitude,
  nearFilter,
  startDate,
  endDate,
  MapExploreInfiniteScrollStyle,
}) => {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    QueryStateMapExploreList(
      latitude,
      longitude,
      nearFilter,
      startDate,
      endDate,
    );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer style={MapExploreInfiniteScrollStyle} ref={ref}>
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

export default MapExploreListInfiniteScroll;
