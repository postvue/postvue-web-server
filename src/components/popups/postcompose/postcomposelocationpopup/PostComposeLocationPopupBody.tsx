import NoResultComponent from 'components/common/container/NoResultComponent';
import LocationPositionElement from 'components/location/LocationPostionElement';
import { MapAddressRelation } from 'global/interface/map';
import { isValidString } from 'global/util/ValidUtil';
import MapAddressRelationListInfiniteScroll from 'hook/MapAddressRelationRelationInfiniteScroll';
import { QueryStateMapAddressListByGeo } from 'hook/queryhook/QueryStateMapAddressListByGeo';
import { QueryStateMapAddressRelationInfinite } from 'hook/queryhook/QueryStateMapAddressRelationInfinite';
import React, { useEffect, useRef } from 'react';
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { locationSearchWordAtom } from 'states/GeoLocationAtom';
import { isMapSLocationLoadingAtom } from 'states/MapExploreAtom';
import { isActivPostComposeLocationPopupAtom } from 'states/PostComposeAtom';
import styled from 'styled-components';

interface PostComposeLocationPopupBodyProps {
  setAddress: SetterOrUpdater<MapAddressRelation>;
  curPositionInfo: {
    latitude: number;
    longitude: number;
    isActive: boolean;
  };
  PostComposeLocationPopupBodyContainerStyle?: React.CSSProperties;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostComposeLocationPopupBody: React.FC<
  PostComposeLocationPopupBodyProps
> = ({
  setAddress,
  curPositionInfo,
  PostComposeLocationPopupBodyContainerStyle,
  setIsExternalCloseFunc,
}) => {
  const setIsActivPostComposeLocationPopup = useSetRecoilState(
    isActivPostComposeLocationPopupAtom,
  );

  const [locationSearchWord, setLocationSearchWord] = useRecoilState(
    locationSearchWordAtom,
  );
  const loadingByAddressBySearch = useRecoilValue(isMapSLocationLoadingAtom);

  const {
    data: relationAddressListBySearchWord,
    isFetched: isFetchedRelatedAddressList,
  } = QueryStateMapAddressRelationInfinite(locationSearchWord);

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
  return (
    <PostComposeLocationContainer
      ref={PostComposeLocationContainerRef}
      style={PostComposeLocationPopupBodyContainerStyle}
    >
      {isValidString(locationSearchWord) &&
        relationAddressListBySearchWord &&
        !loadingByAddressBySearch &&
        relationAddressListBySearchWord.pages.flatMap((v) => v).length > 0 && (
          <PostComposeLocationBodyContainer>
            {relationAddressListBySearchWord.pages.flatMap((v) =>
              v.map((value, key) => {
                return (
                  <LocationPositionElement
                    key={key}
                    buildName={value.buildName}
                    roadAddr={value.roadAddr}
                    onClickAddress={() => {
                      setIsActivPostComposeLocationPopup(false);
                      if (setIsExternalCloseFunc) {
                        console.log('zzz');
                        setIsExternalCloseFunc(true);
                      }
                      onClickAddress(value);
                    }}
                  />
                );
              }),
            )}
            <MapAddressRelationListInfiniteScroll
              srchQry={locationSearchWord}
            />
          </PostComposeLocationBodyContainer>
        )}
      <>
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
                      setIsActivPostComposeLocationPopup(false);
                      if (setIsExternalCloseFunc) {
                        console.log('zzzaaa');
                        setIsExternalCloseFunc(true);
                      }
                      onClickAddress({
                        roadAddr: value.address,
                        buildName: value.buildName,
                      });
                    }}
                  />
                );
              })}
            </PostComposeLocationBodyContainer>
          )}
      </>

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
        !loadingByAddressBySearch && <NoResultComponent />}
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
  gap: 20px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

export default PostComposeLocationPopupBody;
