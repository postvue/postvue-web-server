import React from 'react';

import NoResultComponent from 'components/common/container/NoResultComponent';
import SnsPostVirtualMasonryLayout from 'components/layouts/virtual/masonry/SnsPostVirtualMasonryLayout';
import { PostRsp } from 'global/interface/post';
import styled from 'styled-components';
import theme from 'styles/theme';

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
  scrollElement?: Element;
}

const MapExploreSelectClusterBody: React.FC<MapExploreBodyProps> = ({
  mapClusterPostListInfo,
  mapExploreBodyStyle,
  MapSnsPostLayoutStyle,
  masonryLayoutNum,
  linkPopupInfo,
  funcPrevButton,
  scrollElement,
}) => {
  return (
    <MapExloreBodyContainer style={mapExploreBodyStyle}>
      <>
        {mapClusterPostListInfo.isActive && (
          <>
            {mapClusterPostListInfo.mapPostList.length > 0 ? (
              <SnsPostVirtualMasonryLayout
                // SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
                snsPostList={mapClusterPostListInfo.mapPostList}
                // fixNum={masonryLayoutNum}
                linkPopupInfo={linkPopupInfo}
                actionFunc={funcPrevButton}
                searchType={'distance'}
                scrollElement={scrollElement}
                inViewElement={
                  <div
                    style={{
                      marginBottom: theme.systemSize.bottomNavBar.heightNum * 2,
                    }}
                  ></div>
                }
              />
            ) : (
              // <SnsPostMasonryLayout
              //   SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
              //   snsPostList={mapClusterPostListInfo.mapPostList}
              //   fixNum={masonryLayoutNum}
              //   linkPopupInfo={linkPopupInfo}
              //   actionFunc={funcPrevButton}
              //   searchType={'distance'}
              // />
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
