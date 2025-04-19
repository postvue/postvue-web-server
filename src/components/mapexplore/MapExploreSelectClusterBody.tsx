import React from 'react';

import NoResultComponent from 'components/common/container/NoResultComponent';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { PostRsp } from 'global/interface/post';
import styled from 'styled-components';

interface MapExploreBodyProps {
  mapClusterPostListInfo: {
    isActive: boolean;
    mapPostList: PostRsp[];
  };
  mapExploreBodyStyle?: React.CSSProperties;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  MapExploreInfiniteScrollStyle?: React.CSSProperties;
  masonryLayoutNum?: number;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  funcPrevButton?: () => void;
}

const MapExploreSelectClusterBody: React.FC<MapExploreBodyProps> = ({
  mapClusterPostListInfo,
  mapExploreBodyStyle,
  MapSnsPostLayoutStyle,
  masonryLayoutNum,
  linkPopupInfo,
  funcPrevButton,
}) => {
  return (
    <MapExloreBodyContainer style={mapExploreBodyStyle}>
      <>
        {mapClusterPostListInfo.isActive && (
          <>
            {mapClusterPostListInfo.mapPostList.length > 0 ? (
              <SnsPostMasonryLayout
                SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
                snsPostList={mapClusterPostListInfo.mapPostList}
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
      </>
    </MapExloreBodyContainer>
  );
};

const MapExloreBodyContainer = styled.div``;

export default MapExploreSelectClusterBody;
