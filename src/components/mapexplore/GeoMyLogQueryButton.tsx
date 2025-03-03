import { ReactComponent as GeoPositionRefreshIcon } from 'assets/images/icon/svg/explore/GeoPositionRefreshIcon.svg';
import { QueryStateMapMyPostList } from 'hook/queryhook/QueryStateMapMyPostList';
import React from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import {
  currentSearchQueryAtom,
  mapClusterPostListInfoAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';

interface GeoMyLogQueryButtonProps {
  GeoMyLogQueryButtonStyle?: React.CSSProperties;
  actionFunc?: () => void;
}

const GeoMyLogQueryButton: React.FC<GeoMyLogQueryButtonProps> = ({
  GeoMyLogQueryButtonStyle,
  actionFunc,
}) => {
  const { isFetchingNextPage, fetchNextPage, hasNextPage } =
    QueryStateMapMyPostList();

  const setCurrentSearchQuery = useSetRecoilState(currentSearchQueryAtom);

  const resetMapClusterPostList = useResetRecoilState(
    mapClusterPostListInfoAtom,
  );

  const onClickGeoMyLogQueryButton = () => {
    if (actionFunc) {
      actionFunc();
    }
    resetMapClusterPostList();

    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }

    setCurrentSearchQuery('');
  };

  return (
    <>
      {hasNextPage && !isFetchingNextPage && (
        <GeoMyLogQueryButtonContainer
          onClick={onClickGeoMyLogQueryButton}
          style={GeoMyLogQueryButtonStyle}
        >
          <GeoMyLogQueryButtonWrap>
            <GeoMyLogQueryButtonIconWrap>
              <GeoPositionRefreshIcon />
            </GeoMyLogQueryButtonIconWrap>
            <GeoMyLogQueryButtonTitle>더 보기</GeoMyLogQueryButtonTitle>
          </GeoMyLogQueryButtonWrap>
        </GeoMyLogQueryButtonContainer>
      )}
    </>
  );
};

const GeoMyLogQueryButtonContainer = styled.div`
  z-index: 150;

  display: flex;
  padding: 7px 12px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
  // border: 1px solid ${({ theme }) => theme.grey.Grey2};

  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.25);
`;

const GeoMyLogQueryButtonWrap = styled.div`
  margin: auto auto;
  display: flex;
  gap: 5px;
`;

const GeoMyLogQueryButtonIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const GeoMyLogQueryButtonTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    bottom: -15px;
    left: -15px;
    right: -15px;
    z-index: -1; /* 가상 요소를 버튼 뒤로 배치 */
    background: transparent; /* 투명 */
  }
`;

export default GeoMyLogQueryButton;
