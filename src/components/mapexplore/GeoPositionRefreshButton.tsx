import { ReactComponent as GeoPositionRefreshIcon } from 'assets/images/icon/svg/explore/GeoPositionRefreshIcon.svg';
import { MAP_CONTENT_LOCATION_TYPE } from 'const/MapExploreConst';
import { convertDateToCurrentCountryISO } from 'global/util/DateTimeUtil';
import { QueryStateMapExploreList } from 'hook/queryhook/QueryStateMapExploreList';
import React, { useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {
  currentSearchQueryAtom,
  mapClusterPostListInfoAtom,
  mapContentTypeAtom,
  mapDatePickerPopupInfoAtom,
  mapExploreFilterTabAtom,
  mapLoactionAtom,
  mapMoveLocationAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';

interface GeoPositionRefreshButtonProps {
  GeoPositionRefreshButtonStyle?: React.CSSProperties;
  actionFuncToRefresh?: () => void;
}

const GeoPositionRefreshButton: React.FC<GeoPositionRefreshButtonProps> = ({
  GeoPositionRefreshButtonStyle,
  actionFuncToRefresh,
}) => {
  const [mapLoaction, setMapLoaction] = useRecoilState(mapLoactionAtom);
  const [mapMoveLocation, setMapMoveLocation] =
    useRecoilState(mapMoveLocationAtom);
  const mapExploreFilterTab = useRecoilValue(mapExploreFilterTabAtom);

  const [isQuery, setIsQuery] = useState<boolean>(true);

  const setMapContentType = useSetRecoilState(mapContentTypeAtom);

  const setCurrentSearchQuery = useSetRecoilState(currentSearchQueryAtom);

  const mapDatePickerPopupInfo = useRecoilValue(mapDatePickerPopupInfoAtom);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } =
    QueryStateMapExploreList(
      mapLoaction.latitude,
      mapLoaction.longitude,
      mapExploreFilterTab,
      mapDatePickerPopupInfo.dateInfo.startDate
        ? convertDateToCurrentCountryISO(
            mapDatePickerPopupInfo.dateInfo.startDate,
          )
        : null,
      mapDatePickerPopupInfo.dateInfo.endDate
        ? convertDateToCurrentCountryISO(
            mapDatePickerPopupInfo.dateInfo.endDate,
          )
        : null,
      isQuery,
    );

  const resetMapClusterPostList = useResetRecoilState(
    mapClusterPostListInfoAtom,
  );

  const onClickGeoPositionRefreshButton = () => {
    if (actionFuncToRefresh) {
      actionFuncToRefresh();
    }
    resetMapClusterPostList();
    if (mapMoveLocation.isMoved) {
      setIsQuery(false);
      setMapContentType(MAP_CONTENT_LOCATION_TYPE);

      // @REFER: isMoveCenter을 true로 할 시, 깜박이는 문제 발생
      setMapLoaction({
        latitude: mapMoveLocation.latitude,
        longitude: mapMoveLocation.longitude,
        isMoveCenter: false,
      });
      setMapMoveLocation((prev) => ({ ...prev, isMoved: false }));

      setIsQuery(true);
    } else {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
    setCurrentSearchQuery('');
  };

  return (
    <>
      {(mapMoveLocation.isMoved || (hasNextPage && !isFetchingNextPage)) && (
        <GeoPositionRefreshButtonContainer
          onClick={onClickGeoPositionRefreshButton}
          style={GeoPositionRefreshButtonStyle}
        >
          <GeoPositionRefreshButtonWrap>
            <GeoPositionRefreshButtonIconWrap>
              <GeoPositionRefreshIcon />
            </GeoPositionRefreshButtonIconWrap>
            <GeoPositionRefreshButtonTitle>
              이 지역 검색
            </GeoPositionRefreshButtonTitle>
          </GeoPositionRefreshButtonWrap>
        </GeoPositionRefreshButtonContainer>
      )}
    </>
  );
};

const GeoPositionRefreshButtonContainer = styled.div`
  z-index: 150;

  display: flex;
  padding: 7px 12px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
  // border: 1px solid ${({ theme }) => theme.grey.Grey2};

  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.25);
`;

const GeoPositionRefreshButtonWrap = styled.div`
  margin: auto auto;
  display: flex;
  gap: 5px;
`;

const GeoPositionRefreshButtonIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const GeoPositionRefreshButtonTitle = styled.div`
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

export default GeoPositionRefreshButton;
