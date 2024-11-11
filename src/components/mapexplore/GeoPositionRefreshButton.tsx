import { ReactComponent as GeoPositionRefreshIcon } from 'assets/images/icon/svg/explore/GeoPositionRefreshIcon.svg';
import { QueryStateMapExploreList } from 'hook/queryhook/QueryStateMapExploreList';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  mapExploreFilterTabAtom,
  mapLoactionAtom,
  mapMoveLoactionAtom,
} from 'states/MapExploreAtom';
import styled from 'styled-components';

interface GeoPositionRefreshButtonProps {
  GeoPositionRefreshButtonStyle?: React.CSSProperties;
}

const GeoPositionRefreshButton: React.FC<GeoPositionRefreshButtonProps> = ({
  GeoPositionRefreshButtonStyle,
}) => {
  const [mapLoaction, setMapLoaction] = useRecoilState(mapLoactionAtom);
  const [mapMoveLoaction, setMapMoveLocation] =
    useRecoilState(mapMoveLoactionAtom);
  const mapExploreFilterTab = useRecoilValue(mapExploreFilterTabAtom);

  const [isQuery, setIsQuery] = useState<boolean>(true);

  const { data, isFetching } = QueryStateMapExploreList(
    mapLoaction.latitude,
    mapLoaction.longitude,
    mapExploreFilterTab,
    isQuery,
  );

  const onClickGeoPositionRefreshButton = () => {
    setIsQuery(false);
    setMapLoaction({
      latitude: mapMoveLoaction.latitude,
      longitude: mapMoveLoaction.longitude,
    });
    setMapMoveLocation((prev) => ({ ...prev, isMoved: false }));

    setIsQuery(true);
  };

  return (
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
  );
};

const GeoPositionRefreshButtonContainer = styled.div`
  z-index: 150;

  display: flex;
  padding: 7px 12px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
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
`;

export default GeoPositionRefreshButton;
