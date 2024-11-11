import InViewComponent from 'components/common/container/InViewComponent';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { QueryStateMapExploreList } from './queryhook/QueryStateMapExploreList';

interface MapExploreListInfiniteScrollProps {
  latitude: number;
  longitude: number;
  nearFilter: string;
  MapExploreInfiniteScrollStyle?: React.CSSProperties;
}

const MapExploreListInfiniteScroll: React.FC<
  MapExploreListInfiniteScrollProps
> = ({ latitude, longitude, nearFilter, MapExploreInfiniteScrollStyle }) => {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateMapExploreList(latitude, longitude, nearFilter);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer style={MapExploreInfiniteScrollStyle} ref={ref}>
      <InViewComponent />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default MapExploreListInfiniteScroll;
