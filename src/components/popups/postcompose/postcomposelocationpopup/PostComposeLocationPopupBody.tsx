import NoResultComponent from 'components/common/container/NoResultComponent';
import LocationPositionElement from 'components/location/LocationPostionElement';
import { MapAddressRelation } from 'global/interface/map';
import { isValidString } from 'global/util/ValidUtil';
import useAppleMapSearchWithCache from 'hook/customhook/useAppleMapSearchWithCache';
import MapAddressRelationListInfiniteScroll from 'hook/MapAddressRelationRelationInfiniteScroll';
import { QueryStateMapAddressListByGeo } from 'hook/queryhook/QueryStateMapAddressListByGeo';
import { QueryStateMapAddressRelationInfinite } from 'hook/queryhook/QueryStateMapAddressRelationInfinite';
import React, { useEffect, useRef, useState } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import {
  currentGisInfoAtom,
  locationSearchWordAtom,
} from 'states/GeoLocationAtom';
import { isMapSLocationLoadingAtom } from 'states/MapExploreAtom';
import styled from 'styled-components';

interface PostComposeLocationPopupBodyProps {
  setAddress: SetterOrUpdater<MapAddressRelation>;
  curPositionInfo: {
    latitude: number;
    longitude: number;
    isActive: boolean;
  };
  PostComposeLocationPopupBodyContainerStyle?: React.CSSProperties;
  onClose: () => void;
}

const PostComposeLocationPopupBody: React.FC<
  PostComposeLocationPopupBodyProps
> = ({
  setAddress,
  curPositionInfo,
  PostComposeLocationPopupBodyContainerStyle,
  onClose,
}) => {
  const [locationSearchWord, setLocationSearchWord] = useRecoilState(
    locationSearchWordAtom,
  );
  const loadingByAddressBySearch = useRecoilValue(isMapSLocationLoadingAtom);

  const currentGisInfo = useRecoilValue(currentGisInfoAtom);

  const {
    data: relationAddressListBySearchWord,
    isFetched: isFetchedRelatedAddressList,
  } = QueryStateMapAddressRelationInfinite(
    locationSearchWord,
    currentGisInfo.latitude,
    currentGisInfo.longitude,
  );

  const { data: addressListByGeo, isFetched: isFetchedByAddresListByGeo } =
    QueryStateMapAddressListByGeo(
      curPositionInfo.latitude,
      curPositionInfo.longitude,
      curPositionInfo.isActive,
    );

  useEffect(() => {
    return () => {
      setLocationSearchWord('');
    };
  }, []);

  const onClickAddress = (mapAddressRelation: MapAddressRelation) => {
    setAddress(mapAddressRelation);
  };

  const PostComposeLocationContainerRef = useRef<HTMLDivElement>(null);

  const [isActiveMapApple, setIsActiveMapApple] = useState<boolean>(false);

  const {
    mapAppleSearchList,
    isFetched: isFetchedByMapAppleSearchList,
    isVisible: isVisibleByMapAppleSearch,
  } = useAppleMapSearchWithCache({
    mapSearchWord: locationSearchWord,
    // geoPos: geoPos,
    isActive: isActiveMapApple,
    onDeactive: () => {
      setIsActiveMapApple(false);
    },
  });

  return (
    <PostComposeLocationContainer
      ref={PostComposeLocationContainerRef}
      style={PostComposeLocationPopupBodyContainerStyle}
    >
      {(isFetchedRelatedAddressList || isFetchedByAddresListByGeo) &&
        isValidString(locationSearchWord) &&
        !isVisibleByMapAppleSearch && (
          <SearchOverseasButtonWrap>
            <SearchOverseasButton
              onClick={() => {
                setIsActiveMapApple(true);
              }}
            >
              해외 검색하기
            </SearchOverseasButton>
          </SearchOverseasButtonWrap>
        )}

      {isVisibleByMapAppleSearch ? (
        <>
          {isFetchedByMapAppleSearchList && mapAppleSearchList && (
            <PostComposeLocationBodyContainer>
              {mapAppleSearchList.map((value, key) => {
                return (
                  <LocationPositionElement
                    key={key}
                    buildName={value.placeName}
                    roadAddr={value.roadAddr}
                    onClickAddress={() => {
                      onClickAddress({
                        roadAddr: value.roadAddr,
                        buildName: value.placeName,
                        latitude: value.latitude,
                        longitude: value.longitude,
                      });
                      onClose();
                    }}
                  />
                );
              })}
            </PostComposeLocationBodyContainer>
          )}
        </>
      ) : (
        <>
          {isValidString(locationSearchWord) &&
            relationAddressListBySearchWord &&
            !loadingByAddressBySearch &&
            relationAddressListBySearchWord.pages.flatMap((v) => v).length >
              0 && (
              <PostComposeLocationBodyContainer>
                {relationAddressListBySearchWord.pages.flatMap((v) =>
                  v.map((value, key) => {
                    return (
                      <LocationPositionElement
                        key={key}
                        buildName={value.buildName}
                        roadAddr={value.roadAddr}
                        onClickAddress={() => {
                          onClickAddress(value);
                          onClose();
                        }}
                      />
                    );
                  }),
                )}
                <MapAddressRelationListInfiniteScroll
                  srchQry={locationSearchWord}
                  latitude={currentGisInfo.latitude}
                  longitude={currentGisInfo.longitude}
                />
              </PostComposeLocationBodyContainer>
            )}

          {locationSearchWord === '' &&
            addressListByGeo &&
            !loadingByAddressBySearch && (
              <PostComposeLocationBodyContainer>
                {addressListByGeo.map((value, key) => {
                  return (
                    <LocationPositionElement
                      key={key}
                      buildName={value.buildName}
                      roadAddr={value.address}
                      onClickAddress={() => {
                        onClickAddress({
                          roadAddr: value.address,
                          buildName: value.buildName,
                          latitude: value.latitude,
                          longitude: value.longitude,
                        });
                        onClose();
                      }}
                    />
                  );
                })}
              </PostComposeLocationBodyContainer>
            )}
        </>
      )}

      {(((!relationAddressListBySearchWord ||
        (relationAddressListBySearchWord &&
          relationAddressListBySearchWord?.pages.flatMap((v) => v).length <=
            0)) &&
        isFetchedRelatedAddressList &&
        locationSearchWord !== '') ||
        (locationSearchWord == '' &&
          addressListByGeo &&
          isFetchedByAddresListByGeo &&
          addressListByGeo?.length <= 0)) &&
        !loadingByAddressBySearch &&
        !isVisibleByMapAppleSearch && <NoResultComponent />}

      {isFetchedByMapAppleSearchList &&
        isVisibleByMapAppleSearch &&
        mapAppleSearchList &&
        mapAppleSearchList.length <= 0 && <NoResultComponent />}
    </PostComposeLocationContainer>
  );
};

const PostComposeLocationContainer = styled.div`
  flex: 1;
`;

const PostComposeLocationBodyContainer = styled.div`
  margin-top: 10px;

  display: flex;
  flex-flow: column;

  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SearchOverseasButtonWrap = styled.div`
  display: flex;
  padding-top: 5px;
`;

const SearchOverseasButton = styled.div`
  display: flex;
  margin: 0 auto;
  border-radius: 22px;
  padding: 8px 13px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  font: ${({ theme }) => theme.fontSizes.Body1};
`;

export default PostComposeLocationPopupBody;
