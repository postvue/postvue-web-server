import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { MapAddressRelation } from 'global/interface/map';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMapAddressListByGeo } from 'hook/queryhook/QueryStateMapAddressListByGeo';
import React, { useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { isActivPostComposeLocationPopupAtom } from 'states/PostComposeAtom';
import theme from 'styles/theme';
import LoadingPopup from '../../LoadingPopup';
import PostComposeLocationPopupBody from './PostComposeLocationPopupBody';
import PostComposeLocationPopupHeader from './PostComposeLocationPopupHeader';

interface PostComposeLocationPopupProps {
  setAddress: SetterOrUpdater<MapAddressRelation>;
  hasTransparentOverLay?: boolean;
}

const PostComposeLocationPopup: React.FC<PostComposeLocationPopupProps> = ({
  setAddress,
  hasTransparentOverLay = false,
}) => {
  const [isActivPostComposeLocationPopup, setIsActivPostComposeLocationPopup] =
    useRecoilState(isActivPostComposeLocationPopupAtom);

  const [loadingByAddressGeo, setLoadingByAddressGeo] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

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

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsActivPostComposeLocationPopup}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={popupWrapStyle}
        //   hasFixedActive={true}
        // >
        //   <PostComposeLocationPopupBody
        //     setAddress={setAddress}
        //     curPositionInfo={curPositionInfo}
        //   />
        // </PopupLayout>
        <BottomSnapSheetLayout
          isOpen={isActivPostComposeLocationPopup}
          onClose={() => {
            setIsActivPostComposeLocationPopup(false);
          }}
          initDuration={0}
          heightNum={window.innerHeight * (5 / 6)}
          isExternalCloseFunc={isExternalCloseFunc}
          bottomSheetHeader={
            <PostComposeLocationPopupHeader
              setCurPositionInfo={setCurPositionInfo}
              setLoadingByAddressGeo={setLoadingByAddressGeo}
              onClose={() => setIsExternalCloseFunc(true)}
            />
          }
        >
          <PostComposeLocationPopupBody
            setAddress={setAddress}
            curPositionInfo={curPositionInfo}
            onClose={() => setIsExternalCloseFunc(true)}
          />
        </BottomSnapSheetLayout>
      ) : (
        <>
          {isActivPostComposeLocationPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActivPostComposeLocationPopup(false)}
              popupWrapStyle={{ height: '90%' }}
              hasTransparentOverLay={hasTransparentOverLay}
              hasFixedActive={false}
            >
              <PostComposeLocationPopupHeader
                setCurPositionInfo={setCurPositionInfo}
                setLoadingByAddressGeo={setLoadingByAddressGeo}
                PostComposeLocationTitleStyle={{ flexShrink: '0' }}
                LocatoinSearchInputContainerStyle={{ flexShrink: '0' }}
                onClose={() => setIsActivPostComposeLocationPopup(false)}
              />
              <PostComposeLocationPopupBody
                setAddress={setAddress}
                curPositionInfo={curPositionInfo}
                PostComposeLocationPopupBodyContainerStyle={{
                  flexGrow: '1',
                  overflow: 'auto',
                }}
                onClose={() => setIsActivPostComposeLocationPopup(false)}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}

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

export default PostComposeLocationPopup;
