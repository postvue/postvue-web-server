import React from 'react';

import {
  MAP_CONTENT_LOCATION_TYPE,
  MAP_CONTENT_POST_TYPE,
} from 'const/MapExploreConst';
import { useRecoilValue } from 'recoil';
import {
  isActiveMyMapAtom,
  mapClusterPostListInfoAtom,
  mapContentTypeAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';
import MapExploreLocationContentBody from './MapExploreLocationContentBody';
import MapExploreMyPostBody from './MapExploreMyPostBody';
import MapExplorePostContentBody from './MapExplorePostContentBody';
import MapExploreSelectClusterBody from './MapExploreSelectClusterBody';

interface MapExploreBodyProps {
  latitude: number;
  longitude: number;
  distance?: number;
  mapExploreBodyStyle?: React.CSSProperties;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  MapExploreInfiniteScrollStyle?: React.CSSProperties;
  masonryLayoutNum?: number;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  funcPrevButton?: () => void;
  scrollElement?: Element;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const MapExploreBody: React.FC<MapExploreBodyProps> = ({
  latitude,
  longitude,
  distance,
  mapExploreBodyStyle,
  MapSnsPostLayoutStyle,
  MapExploreInfiniteScrollStyle,
  masonryLayoutNum,
  linkPopupInfo,
  funcPrevButton,
  scrollElement,
  scrollRef,
}) => {
  const mapContentType = useRecoilValue(mapContentTypeAtom);

  const mapClusterPostListInfo = useRecoilValue(mapClusterPostListInfoAtom);

  const isActiveMyMap = useRecoilValue(isActiveMyMapAtom);

  return (
    <MapExloreBodyContainer style={mapExploreBodyStyle} ref={scrollRef}>
      {!isActiveMyMap && (
        <>
          <div
            style={{
              display: mapClusterPostListInfo.isActive ? 'none' : 'block',
            }}
          >
            {mapContentType === MAP_CONTENT_LOCATION_TYPE && (
              <MapExploreLocationContentBody
                mapContentType={mapContentType}
                latitude={latitude}
                longitude={longitude}
                distance={distance}
                MapSnsPostLayoutStyle={MapSnsPostLayoutStyle}
                MapExploreInfiniteScrollStyle={MapExploreInfiniteScrollStyle}
                masonryLayoutNum={masonryLayoutNum}
                linkPopupInfo={linkPopupInfo}
                funcPrevButton={funcPrevButton}
                scrollElement={scrollElement}
              />
            )}
            {mapContentType === MAP_CONTENT_POST_TYPE && (
              <MapExplorePostContentBody
                mapContentType={mapContentType}
                latitude={latitude}
                longitude={longitude}
                MapSnsPostLayoutStyle={MapSnsPostLayoutStyle}
                masonryLayoutNum={masonryLayoutNum}
                linkPopupInfo={linkPopupInfo}
                funcPrevButton={funcPrevButton}
                scrollElement={scrollElement}
              />
            )}
          </div>
          <MapExploreSelectClusterBody
            mapClusterPostListInfo={mapClusterPostListInfo}
            MapSnsPostLayoutStyle={MapSnsPostLayoutStyle}
            MapExploreInfiniteScrollStyle={MapExploreInfiniteScrollStyle}
            masonryLayoutNum={masonryLayoutNum}
            linkPopupInfo={linkPopupInfo}
            funcPrevButton={funcPrevButton}
            scrollElement={scrollElement}
          />
        </>
      )}
      {isActiveMyMap && (
        <MapExploreMyPostBody
          isActiveMyMap={isActiveMyMap}
          MapSnsPostLayoutStyle={MapSnsPostLayoutStyle}
          masonryLayoutNum={masonryLayoutNum}
          linkPopupInfo={linkPopupInfo}
          funcPrevButton={funcPrevButton}
          scrollElement={scrollElement}
        />
      )}
    </MapExloreBodyContainer>
  );
};

const MapExloreBodyContainer = styled.div``;

export default MapExploreBody;
