import { ReactComponent as CurrentPositionButtonIcon } from 'assets/images/icon/svg/navbar/MapTabActiveIcon.svg';
import LocationSearchHeader from 'components/posecompose/PostComposeLocation/LocationSearchHeader';
import { getCurrentPosition } from 'global/util/PositionUtil';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { locationSearchWordAtom } from 'states/GeoLocationAtom';
import { isActivPostComposeLocationPopupAtom } from 'states/PostComposeAtom';
import styled from 'styled-components';

interface PostComposeLocationPopupHeaderProps {
  setCurPositionInfo: React.Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
      isActive: boolean;
    }>
  >;
  setLoadingByAddressGeo: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
  PostComposeLocationTitleStyle?: React.CSSProperties;
  LocatoinSearchInputContainerStyle?: React.CSSProperties;
}

const PostComposeLocationPopupHeader: React.FC<
  PostComposeLocationPopupHeaderProps
> = ({
  setCurPositionInfo,
  setLoadingByAddressGeo,
  setIsExternalCloseFunc,
  PostComposeLocationTitleStyle,
  LocatoinSearchInputContainerStyle,
}) => {
  const setLocationSearchWord = useSetRecoilState(locationSearchWordAtom);
  const setIsActivPostComposeLocationPopup = useSetRecoilState(
    isActivPostComposeLocationPopupAtom,
  );
  const onClickGeoCurrentButton = async () => {
    setLoadingByAddressGeo(true);

    getCurrentPosition(
      (position) => {
        setCurPositionInfo({
          latitude: position.latitude,
          longitude: position.longitude,
          isActive: true,
        });
        setLocationSearchWord('');
        setLoadingByAddressGeo(false);
      },
      () => {
        setLoadingByAddressGeo(false);
      },
    );
  };
  return (
    <>
      <PostComposeLocationTitle style={PostComposeLocationTitleStyle}>
        <PostComposeCurPositionButton onClick={onClickGeoCurrentButton}>
          <CurrentPositionButtonIcon />
        </PostComposeCurPositionButton>
        <PostComposeLocationHeaderTitle>위치</PostComposeLocationHeaderTitle>
        <PostComposeLocationCloseButton
          onClick={() => {
            setIsActivPostComposeLocationPopup(false);
            if (setIsExternalCloseFunc) {
              setIsExternalCloseFunc(true);
            }
          }}
        >
          닫기
        </PostComposeLocationCloseButton>
      </PostComposeLocationTitle>
      <LocatoinSearchInputWrap style={LocatoinSearchInputContainerStyle}>
        <LocationSearchHeader />
      </LocatoinSearchInputWrap>
    </>
  );
};

const PostComposeLocationHeaderTitle = styled.div`
  left: 50%;
  position: absolute;
  transform: translate(-50%, 50%);

  margin: auto;

  font: ${({ theme }) => theme.fontSizes.Headline1};
`;

const PostComposeLocationTitle = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

const PostComposeCurPositionButton = styled.div`
  position: absolute;
  transform: translate(0, 50%);
  left: 0px;
  cursor: pointer;
  margin-left: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeLocationCloseButton = styled.div`
  position: absolute;
  font: ${({ theme }) => theme.fontSizes.Body4};
  right: 0px;
  cursor: pointer;
  transform: translate(0, 50%);
  margin-right: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
  z-index: 100;
`;

const LocatoinSearchInputWrap = styled.div``;

export default PostComposeLocationPopupHeader;
