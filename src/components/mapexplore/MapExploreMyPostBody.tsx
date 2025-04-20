import React from 'react';

import NoResultComponent from 'components/common/container/NoResultComponent';
import SnsPostVirtualMasonryLayout from 'components/layouts/virtual/masonry/SnsPostVirtualMasonryLayout';
import MapMyPostListInfiniteScroll from 'hook/MapMyPostListInfiniteScroll';
import { QueryStateMapMyPostList } from 'hook/queryhook/QueryStateMapMyPostList';

interface MapExploreBodyProps {
  isActiveMyMap: boolean;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  masonryLayoutInfo?: {
    masonryLayoutNum: number;
    masonryWidth: number;
  };
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };

  funcPrevButton?: () => void;
  scrollElement?: Element;
}

const MapExploreMyPostBody: React.FC<MapExploreBodyProps> = ({
  isActiveMyMap,
  MapSnsPostLayoutStyle,
  masonryLayoutInfo,
  linkPopupInfo,
  funcPrevButton,
  scrollElement,
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
            <SnsPostVirtualMasonryLayout
              // SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
              snsPostList={mapMyPostList.pages.flatMap((v) => v)}
              columnNum={masonryLayoutInfo?.masonryLayoutNum}
              masonryWidth={masonryLayoutInfo?.masonryWidth}
              linkPopupInfo={linkPopupInfo}
              actionFunc={funcPrevButton}
              searchType={'distance'}
              scrollElement={scrollElement}
              inViewElement={<MapMyPostListInfiniteScroll />}
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

      {/* {isFetchedByMapMyPostList && (
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
      <MapMyPostListInfiniteScroll /> */}
    </>
  );
};

export default MapExploreMyPostBody;
