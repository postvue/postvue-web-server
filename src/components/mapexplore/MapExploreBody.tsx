import React from 'react';

import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import {
  MAP_CONTENT_LOCATION_TYPE,
  MAP_CONTENT_POST_TYPE,
} from 'const/MapExploreConst';
import MapExploreListInfiniteScroll from 'hook/MapExploreListInfiniteScroll';
import { QueryStateMapExploreList } from 'hook/queryhook/QueryStateMapExploreList';
import { QueryStatePostMapPostInfinite } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import { useRecoilValue } from 'recoil';
import {
  mapContentTypeAtom,
  mapExploreFilterTabAtom,
  mapSearchPostWordAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';

interface MapExploreBodyProps {
  latitude: number;
  longitude: number;
  mapExploreBodyStyle?: React.CSSProperties;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  MapExploreInfiniteScrollStyle?: React.CSSProperties;
}

const MapExploreBody: React.FC<MapExploreBodyProps> = ({
  latitude,
  longitude,
  mapExploreBodyStyle,
  MapSnsPostLayoutStyle,
  MapExploreInfiniteScrollStyle,
}) => {
  const mapExploreFilterTab = useRecoilValue(mapExploreFilterTabAtom);
  const mapContentType = useRecoilValue(mapContentTypeAtom);
  const { data: postMapLocation } = QueryStateMapExploreList(
    latitude,
    longitude,
    mapExploreFilterTab,
  );
  const mapSearchPostWord = useRecoilValue(mapSearchPostWordAtom);

  const { data: postMapPost } =
    QueryStatePostMapPostInfinite(mapSearchPostWord);

  return (
    <MapExloreBodyContainer style={mapExploreBodyStyle}>
      {mapContentType === MAP_CONTENT_LOCATION_TYPE && postMapLocation && (
        <>
          <SnsPostMasonryLayout
            SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
            snsPostList={postMapLocation?.pages.flatMap((v) =>
              v.map((value) => value),
            )}
          />
          <MapExploreListInfiniteScroll
            latitude={latitude}
            longitude={longitude}
            MapExploreInfiniteScrollStyle={MapExploreInfiniteScrollStyle}
            nearFilter={mapExploreFilterTab}
          />
        </>
      )}
      {mapContentType === MAP_CONTENT_POST_TYPE && postMapPost && (
        <>
          <SnsPostMasonryLayout
            SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
            snsPostList={postMapPost?.pages.flatMap((v) =>
              v.map((value) => value),
            )}
          />
          <MapExploreListInfiniteScroll
            latitude={latitude}
            longitude={longitude}
            MapExploreInfiniteScrollStyle={MapExploreInfiniteScrollStyle}
            nearFilter={mapExploreFilterTab}
          />
        </>
      )}
    </MapExloreBodyContainer>
  );
};

const MapExloreBodyContainer = styled.div``;

export default MapExploreBody;
