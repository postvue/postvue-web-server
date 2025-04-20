import React, { useEffect, useRef, useState } from 'react';

import NoResultComponent from 'components/common/container/NoResultComponent';
import SnsPostVirtualMasonryLayout from 'components/layouts/virtual/masonry/SnsPostVirtualMasonryLayout';
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
  distance?: number;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  MapExploreInfiniteScrollStyle?: React.CSSProperties;
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

const MapExploreLocationContentBody: React.FC<MapExploreBodyProps> = ({
  mapContentType,
  latitude,
  longitude,
  distance,
  MapSnsPostLayoutStyle,
  MapExploreInfiniteScrollStyle,
  masonryLayoutInfo,
  linkPopupInfo,
  funcPrevButton,
  scrollElement,
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
      distance,
    );

  const [init, setInit] = useState<boolean>(false);

  const initTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setInit(false);
    initTimerRef.current = setTimeout(() => {
      setInit(true);
    }, 500);

    return () => {
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
      }
    };
  }, [latitude + '_' + longitude + '_' + mapExploreFilterTab]);

  return (
    <>
      {isFetchedByPostMapLocation && init && (
        <>
          {postMapLocation &&
          postMapLocation?.pages.flatMap((v) => v).length > 0 ? (
            <>
              <SnsPostVirtualMasonryLayout
                // SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
                snsPostList={postMapLocation?.pages.flatMap((v) =>
                  v.map((value) => value),
                )}
                columnNum={masonryLayoutInfo?.masonryLayoutNum}
                masonryWidth={masonryLayoutInfo?.masonryWidth}
                linkPopupInfo={linkPopupInfo}
                actionFunc={funcPrevButton}
                searchType={'distance'}
                scrollElement={scrollElement}
                inViewElement={
                  <MapExploreListInfiniteScroll
                    latitude={latitude}
                    longitude={longitude}
                    MapExploreInfiniteScrollStyle={
                      MapExploreInfiniteScrollStyle
                    }
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
                    distance={distance}
                  />
                }
              />

              {/* <SnsPostMasonryLayout
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
                distance={distance}
              /> */}
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
