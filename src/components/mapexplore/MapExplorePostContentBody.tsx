import React, { useEffect, useState } from 'react';

import NoResultComponent from 'components/common/container/NoResultComponent';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { MAP_CONTENT_POST_TYPE, MapContentType } from 'const/MapExploreConst';
import { convertDateToCurrentCountryISO } from 'global/util/DateTimeUtil';
import MapPostListInfiniteScroll from 'hook/MapExplorePostListInfiniteScroll';
import { QueryStatePostMapPostInfinite } from 'hook/queryhook/QueryStatePostMapPostInfinite';
import { useRecoilValue } from 'recoil';
import {
  mapDatePickerPopupInfoAtom,
  mapSearchPostWordAtom,
} from 'states/MapExploreAtom';

interface MapExploreBodyProps {
  mapContentType: MapContentType;
  latitude: number;
  longitude: number;
  MapSnsPostLayoutStyle?: React.CSSProperties;
  masonryLayoutNum?: number;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  funcPrevButton?: () => void;
}

const MapExplorePostContentBody: React.FC<MapExploreBodyProps> = ({
  latitude,
  longitude,
  mapContentType,
  MapSnsPostLayoutStyle,
  masonryLayoutNum,
  linkPopupInfo,
  funcPrevButton,
}) => {
  const mapSearchPostWord = useRecoilValue(mapSearchPostWordAtom);
  const mapDatePickerPopupInfo = useRecoilValue(mapDatePickerPopupInfoAtom);

  const { data: postMapPost, isFetched: isFetchedByPostMapPost } =
    QueryStatePostMapPostInfinite(
      mapSearchPostWord,
      latitude,
      longitude,
      mapContentType === MAP_CONTENT_POST_TYPE,
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
    );

  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setInit(false);
    setTimeout(() => {
      setInit(true);
    }, 500);
  }, [mapSearchPostWord + '_' + latitude + '_' + longitude]);

  return (
    <>
      {isFetchedByPostMapPost && init && (
        <>
          {postMapPost && postMapPost?.pages.flatMap((v) => v).length >= 0 ? (
            <>
              <SnsPostMasonryLayout
                SnsPostMasonryLayoutStyle={MapSnsPostLayoutStyle}
                snsPostList={postMapPost?.pages.flatMap((v) =>
                  v.map((value) => value),
                )}
                fixNum={masonryLayoutNum}
                linkPopupInfo={linkPopupInfo}
                actionFunc={funcPrevButton}
                searchType={'distance'}
              />
              <MapPostListInfiniteScroll
                searchWord={mapSearchPostWord}
                latitude={latitude}
                longitude={longitude}
                startDate={
                  mapDatePickerPopupInfo.dateInfo.startDate
                    ? convertDateToCurrentCountryISO(
                        mapDatePickerPopupInfo.dateInfo.startDate,
                      )
                    : null
                }
                isActive={mapContentType === MAP_CONTENT_POST_TYPE}
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

export default MapExplorePostContentBody;
