import React from 'react';

import NoResultComponent from 'components/common/container/NoResultComponent';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import MapMyPostListInfiniteScroll from 'hook/MapMyPostListInfiniteScroll';
import { QueryStateMapMyPostList } from 'hook/queryhook/QueryStateMapMyPostList';

interface MapExploreBodyProps {
  isActiveMyMap: boolean;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  masonryLayoutNum?: number;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  funcPrevButton?: () => void;
}

const MapExploreMyPostBody: React.FC<MapExploreBodyProps> = ({
  isActiveMyMap,
  MapSnsPostLayoutStyle,
  masonryLayoutNum,
  linkPopupInfo,
  funcPrevButton,
}) => {
  const { data: mapMyPostList, isFetched: isFetchedByMapMyPostList } =
    QueryStateMapMyPostList(isActiveMyMap);

  return (
    <>
      {isFetchedByMapMyPostList && (
        <>
          {mapMyPostList &&
          mapMyPostList &&
          mapMyPostList.pages.flatMap((v) => v).length > 0 ? (
            <SnsPostMasonryLayout
              SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
              snsPostList={mapMyPostList.pages.flatMap((v) => v)}
              fixNum={masonryLayoutNum}
              linkPopupInfo={linkPopupInfo}
              actionFunc={funcPrevButton}
              searchType={'distance'}
            />
          ) : (
            <NoResultComponent
              NoResultTitleStyle={{
                top: '20%',
                transform: 'translate(-50%,0%)',
              }}
            />
          )}
        </>
      )}
      <MapMyPostListInfiniteScroll />
    </>
  );
};

export default MapExploreMyPostBody;
