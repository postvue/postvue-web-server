import { getRoundedNumber } from 'global/util/MathUtil';
import { getPosInfoByGis } from 'global/util/PositionUtil';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { PostMapPostInfiniteInterface } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { mapMoveLocationAtom } from 'states/MapExploreAtom';
import styled from 'styled-components';
import MapkitClient, { MoveLocationType } from './MapkitClient';

interface AppleMapElementProps {
  mapPost: PostMapPostInfiniteInterface | undefined;
  coordinateSpan?: number;
  initAnnotationTime?: number;
}

const AppleMapElement: React.FC<AppleMapElementProps> = ({
  mapPost,
  coordinateSpan,
  initAnnotationTime,
}) => {
  const setMapMoveLoation = useSetRecoilState(mapMoveLocationAtom);

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      const { latitude, longitude } = JSON.parse(word);

      getPosInfoByGis(latitude, longitude).then((v) => {
        setMapMoveLoation((prev) => ({
          ...prev,
          regionInfo: {
            city: v.city,
            continent: v.continent,
            continentCode: v.continentCode,
            countryCode: v.countryCode,
            countryName: v.countryName,
            locality: v.locality,
          },
        }));
      });
    },
    [],
    1000,
  );

  interface RoundedPosNumberType {
    latitude: number;
    longitude: number;
  }
  const getRoundedNumberFunc = (
    pos: RoundedPosNumberType,
  ): RoundedPosNumberType => {
    const roundedLatitude = getRoundedNumber(pos.latitude, 1e7);
    const roundedLongitude = getRoundedNumber(pos.longitude, 1e7);

    const roundedData = {
      latitude: roundedLatitude,
      longitude: roundedLongitude,
    };

    return roundedData;
  };

  const scrollEndEventFunc = (e: mapkit.EventBase<mapkit.Map>) => {
    const { latitude, longitude } = e.target.center;

    const roundedData = getRoundedNumberFunc({
      latitude: latitude,
      longitude: longitude,
    });

    setMapMoveLoation((prev) => ({
      ...prev,
      latitude: roundedData.latitude,
      longitude: roundedData.longitude,
      isMoved: true,
    }));

    // saveInitGeoPosition({
    //   latitude: roundedLatitude,
    //   longitude: roundedLongitude,
    //   isMoveCenter: false,
    // });
    debouncedGetSearchQuery(JSON.stringify(roundedData));
  };

  const onSetMapMoveLocation = (moveLocation: MoveLocationType) => {
    const roundedData = getRoundedNumberFunc({
      latitude: moveLocation.latitude,
      longitude: moveLocation.longitude,
    });

    setMapMoveLoation((prev) => ({
      ...prev,
      isMoved: moveLocation.isMoved,
      latitude: roundedData.latitude,
      longitude: roundedData.longitude,
    }));

    debouncedGetSearchQuery(JSON.stringify(roundedData));
  };

  return (
    <>
      <AppleMapElementWrap>
        <MapkitClient
          mapPost={mapPost}
          onSetMapMoveLocation={onSetMapMoveLocation}
          scrollEndEventFunc={scrollEndEventFunc}
          coordinateSpan={coordinateSpan}
          initAnnotationTime={initAnnotationTime}
        />
      </AppleMapElementWrap>
    </>
  );
};

const AppleMapElementWrap = styled.div`
  height: 100%;
  .mk-map-view {
    border-radius: 30px;
  }
`;

export default AppleMapElement;
