import { ReactComponent as CurrentPositionButtonIcon } from 'assets/images/icon/svg/navbar/MapTabActiveIcon.svg';
import LocationPositionElement from 'components/location/LocationPostionElement';
import LocationSearchHeader from 'components/posecompose/PostComposeLocation/LocationSearchHeader';
import { MapAddressRelation } from 'global/interface/map';
import { getCurrentPosition } from 'global/util/PositionUtil';
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
import theme from 'styles/theme';

interface PostComposeLocationPopupBodyProps {
  setAddress: SetterOrUpdater<MapAddressRelation>;
  curPositionInfo: {
    latitude: number;
    longitude: number;
    isActive: boolean;
  };
  setCurPositionInfo: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
      isActive: boolean;
    }>
  >;
  setLoadingByAddressGeo: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostComposeLocationPopupBody: React.FC<
  PostComposeLocationPopupBodyProps
> = ({
  setAddress,
  curPositionInfo,
  setCurPositionInfo,
  setLoadingByAddressGeo,
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

  const onClickGeoCurrentButton = async () => {
    setLoadingByAddressGeo(true);
    getCurrentPosition((position) => {
      setCurPositionInfo({
        latitude: position.latitude,
        longitude: position.longitude,
        isActive: true,
      });
      setLocationSearchWord('');
      setLoadingByAddressGeo(false);
    });
  };

  useEffect(() => {
    return () => {
      setLocationSearchWord('');
    };
  }, []);

  const onClickAddress = (mapAddressRelation: MapAddressRelation) => {
    setAddress(mapAddressRelation);
    setIsActivPostComposeLocationPopup(false);
  };

  const PostComposeLocationContainerRef = useRef<HTMLDivElement>(null);
  return (
    <PostComposeLocationContainer ref={PostComposeLocationContainerRef}>
      <PostComposeLocationTitle>
        <PostComposeCurPositionButton onClick={onClickGeoCurrentButton}>
          <CurrentPositionButtonIcon />
        </PostComposeCurPositionButton>
        <PostComposeLocationHeaderTitle>위치</PostComposeLocationHeaderTitle>
        <PostComposeLocationCloseButton
          onClick={() => {
            setIsActivPostComposeLocationPopup(false);
          }}
        >
          닫기
        </PostComposeLocationCloseButton>
      </PostComposeLocationTitle>
      <LocatoinSearchInputWrap>
        <LocationSearchHeader />
      </LocatoinSearchInputWrap>

      <PostComposeLocationBodyContainer
        $height={PostComposeLocationContainerRef.current?.offsetHeight}
      >
        {isValidString(locationSearchWord) &&
          relationAddressListBySearchWord &&
          !loadingByAddressBySearch && (
            <>
              {relationAddressListBySearchWord.pages.flatMap((v) =>
                v.map((value, key) => {
                  return (
                    <LocationPositionElement
                      key={key}
                      buildName={value.buildName}
                      roadAddr={value.roadAddr}
                      onClickAddress={() => onClickAddress(value)}
                    />
                  );
                }),
              )}
            </>
          )}
        <>
          {locationSearchWord === '' &&
            addressListByGeo &&
            !loadingByAddressBySearch && (
              <>
                {addressListByGeo.map((value, key) => {
                  return (
                    <LocationPositionElement
                      key={key}
                      buildName={value.buildName}
                      roadAddr={value.address}
                      onClickAddress={() =>
                        onClickAddress({
                          roadAddr: value.address,
                          buildName: value.buildName,
                        })
                      }
                    />
                  );
                })}
              </>
            )}
        </>
        <MapAddressRelationListInfiniteScroll srchQry={locationSearchWord} />
      </PostComposeLocationBodyContainer>
      {(((!relationAddressListBySearchWord ||
        (relationAddressListBySearchWord &&
          relationAddressListBySearchWord?.pages.flatMap((v) => v).length <=
            0)) &&
        isFetchedRelatedAddressList &&
        locationSearchWord !== '') ||
        (isValidString(locationSearchWord) &&
          addressListByGeo &&
          isFetchedByAddresListByGeo &&
          addressListByGeo?.length <= 0)) &&
        !loadingByAddressBySearch && (
          <NotLocatoinPositionWrap>결과가 없습니다.</NotLocatoinPositionWrap>
        )}
    </PostComposeLocationContainer>
  );
};

theme;
const PostComposeLocationContainer = styled.div`
  margin-top: 29px;
  flex: 1;
`;

const PostComposeLocationHeaderTitle = styled.div`
  left: 50%;
  transform: translate(-50%, 0);
  position: absolute;

  margin: auto;

  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const PostComposeLocationTitle = styled.div``;

const PostComposeCurPositionButton = styled.div`
  position: absolute;

  left: 0px;
  cursor: pointer;
  margin-left: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeLocationCloseButton = styled.div`
  position: absolute;
  font: ${({ theme }) => theme.fontSizes.Body3};
  right: 0px;
  cursor: pointer;
  margin-right: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeLocationBodyContainer = styled.div<{
  $height: number | undefined;
}>`
  position: fixed;
  overflow-y: scroll;
  margin-top: calc(${({ theme }) => theme.systemSize.header.height} + 5px);
  height: ${(props) =>
    props.$height &&
    props.$height - 2 * theme.systemSize.header.heightNumber}px;

  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  display: flex;
  flex-flow: column;
  gap: 20px;
  width: 100%;
`;

const LocatoinSearchInputWrap = styled.div`
  margin-top: 32px;
`;

const NotLocatoinPositionWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
`;

export default PostComposeLocationPopupBody;
