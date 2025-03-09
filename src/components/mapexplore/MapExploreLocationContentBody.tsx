import React, { useEffect, useState } from 'react';

import NoResultComponent from 'components/common/container/NoResultComponent';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import {
  MAP_CONTENT_LOCATION_TYPE,
  MapContentType,
} from 'const/MapExploreConst';
import { convertDateToCurrentCountryISO } from 'global/util/DateTimeUtil';
import MapExploreListInfiniteScroll from 'hook/MapExploreListInfiniteScroll';
import { QueryStateMapExploreList } from 'hook/queryhook/QueryStateMapExploreList';
import { useRecoilValue } from 'recoil';
import {
  mapDatePickerPopupInfoAtom,
  mapExploreFilterTabAtom,
} from 'states/MapExploreAtom';

interface MapExploreBodyProps {
  mapContentType: MapContentType;
  latitude: number;
  longitude: number;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  MapExploreInfiniteScrollStyle?: React.CSSProperties;
  masonryLayoutNum?: number;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  funcPrevButton?: () => void;
}

const MapExploreLocationContentBody: React.FC<MapExploreBodyProps> = ({
  mapContentType,
  latitude,
  longitude,
  MapSnsPostLayoutStyle,
  MapExploreInfiniteScrollStyle,
  masonryLayoutNum,
  linkPopupInfo,
  funcPrevButton,
}) => {
  const mapExploreFilterTab = useRecoilValue(mapExploreFilterTabAtom);

  const mapDatePickerPopupInfo = useRecoilValue(mapDatePickerPopupInfoAtom);
  const { data: postMapLocation, isFetched: isFetchedByPostMapLocation } =
    QueryStateMapExploreList(
      latitude,
      longitude,
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
      mapContentType === MAP_CONTENT_LOCATION_TYPE,
    );

  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setInit(false);
    setTimeout(() => {
      setInit(true);
    }, 500);
  }, [latitude + '_' + longitude + '_' + mapExploreFilterTab]);

  return (
    <>
      {isFetchedByPostMapLocation && init && (
        <>
          {postMapLocation &&
          postMapLocation?.pages.flatMap((v) => v).length > 0 ? (
            <>
              <SnsPostMasonryLayout
                SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
                snsPostList={postMapLocation?.pages.flatMap((v) =>
                  v.map((value) => value),
                )}
                fixNum={masonryLayoutNum}
                linkPopupInfo={linkPopupInfo}
                actionFunc={funcPrevButton}
                searchType={'distance'}
              />
              <MapExploreListInfiniteScroll
                latitude={latitude}
                longitude={longitude}
                MapExploreInfiniteScrollStyle={MapExploreInfiniteScrollStyle}
                nearFilter={mapExploreFilterTab}
                startDate={
                  mapDatePickerPopupInfo.dateInfo.startDate
                    ? convertDateToCurrentCountryISO(
                        mapDatePickerPopupInfo.dateInfo.startDate,
                      )
                    : null
                }
                endDate={
                  mapDatePickerPopupInfo.dateInfo.endDate
                    ? convertDateToCurrentCountryISO(
                        mapDatePickerPopupInfo.dateInfo.endDate,
                      )
                    : null
                }
              />
            </>
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
  );
};

export default MapExploreLocationContentBody;
