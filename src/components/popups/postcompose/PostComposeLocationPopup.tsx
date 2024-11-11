import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import PopupLayout from 'components/layouts/PopupLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { MapAddressRelation } from 'global/interface/map';
import { QueryStateMapAddressListByGeo } from 'hook/queryhook/QueryStateMapAddressListByGeo';
import React, { useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { isActivPostComposeLocationPopupAtom } from 'states/PostComposeAtom';
import theme from 'styles/theme';
import LoadingPopup from '../LoadingPopup';
import PostComposeLocationPopupBody from './PostComposeLocationPopupBody';

interface PostComposeLocationPopupProps {
  setAddress: SetterOrUpdater<MapAddressRelation>;
}

const PostComposeLocationPopup: React.FC<PostComposeLocationPopupProps> = ({
  setAddress,
}) => {
  const [isActivPostComposeLocationPopup, setIsActivPostComposeLocationPopup] =
    useRecoilState(isActivPostComposeLocationPopupAtom);

  const [loadingByAddressGeo, setLoadingByAddressGeo] =
    useState<boolean>(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [curPositionInfo, setCurPositionInfo] = useState<{
    latitude: number;
    longitude: number;
    isActive: boolean;
  }>({ latitude: 0, longitude: 0, isActive: false });

  const { isLoading: isLodingByAddresListByGeo } =
    QueryStateMapAddressListByGeo(
      curPositionInfo.latitude,
      curPositionInfo.longitude,
      curPositionInfo.isActive,
    );

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsActivPostComposeLocationPopup}
          isTouchScrollBar={true}
          popupWrapStyle={popupWrapStyle}
          hasFixedActive={true}
        >
          <PostComposeLocationPopupBody
            setAddress={setAddress}
            curPositionInfo={curPositionInfo}
            setCurPositionInfo={setCurPositionInfo}
            setLoadingByAddressGeo={setLoadingByAddressGeo}
          />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsActivPostComposeLocationPopup}
          popupWrapStyle={{ height: '90%' }}
        >
          <PostComposeLocationPopupBody
            setAddress={setAddress}
            curPositionInfo={curPositionInfo}
            setCurPositionInfo={setCurPositionInfo}
            setLoadingByAddressGeo={setLoadingByAddressGeo}
          />
        </RoundSquareCenterPopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
      {(isLodingByAddresListByGeo || loadingByAddressGeo) && (
        <LoadingPopup
          LoadingPopupStyle={{
            backgroundColor: theme.background.lightBlurBackground,
          }}
        />
      )}
    </>
  );
};

const popupWrapStyle: React.CSSProperties = {
  height: '95%',
};

export default PostComposeLocationPopup;
