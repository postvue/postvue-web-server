import InViewComponent from 'components/common/container/InViewComponent';
import { MAX_NEAR_POST_REQUEST_NUM } from 'const/MapExploreConst';
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
  distance?: number;
  limitCountNum?: number;
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
  distance,
  limitCountNum = MAX_NEAR_POST_REQUEST_NUM,
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
      true,
      distance,
    );

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      data &&
      data?.pages.length < limitCountNum
    ) {
      fetchNextPage();
    }
  }, [inView]); //hasNextPage, isFetchingNextPage

  return (
    <ScrollBottomContainer style={MapExploreInfiniteScrollStyle} ref={ref}>
      <InViewComponent
        hasLoadingIcon={
          (data ? data?.pages[0].length > 5 : false) &&
          hasNextPage &&
          (data ? data.pages.length < limitCountNum : true)
        }
      />
    </ScrollBottomContainer>
  );
};

const ScrollBottomContainer = styled.div`
  margin: 0px auto;
`;

export default MapExploreListInfiniteScroll;
