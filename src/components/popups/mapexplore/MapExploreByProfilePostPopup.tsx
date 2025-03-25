import React, { useEffect, useState } from 'react';

import useWindowSize from 'hook/customhook/useWindowSize';
import { useRecoilState } from 'recoil';
import { isMapExplorePopupAtom } from 'states/MapExploreAtom';

import BottomFullScreenSheetLayout from 'components/layouts/BottomFullScreenSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { PostRsp } from 'global/interface/post';
import theme from 'styles/theme';
import MapExploreByProfilePostPopupBody from './MapExploreByProfilePostPopupBody';

interface MapExploreByProfilePostPpoup {
  snsPost: PostRsp;
}

const MapExploreByProfilePostPopup: React.FC<MapExploreByProfilePostPpoup> = ({
  snsPost,
}) => {
  const [isMapExplorePopup, setIsMapExplorePopup] = useRecoilState(
    isMapExplorePopupAtom,
  );

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    return () => {
      setIsMapExplorePopup(false);
    };
  }, []);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <>
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          popupContentWrapStyle={{ paddingTop: 0 }}
          onClose={() => ''}
          popupWrapStyle={{
            maxWidth: theme.systemSize.appDisplaySize.widthByPc,
          }}
        >
          <MapExploreByProfilePostPopupBody
            snsPost={snsPost}
            funcPrevButton={() => {
              setIsMapExplorePopup(false);
            }}
            isMobile={false}
          />
        </RoundSquareCenterPopupLayout>
      ) : (
        <BottomFullScreenSheetLayout
          isOpen={isMapExplorePopup}
          onClose={() => setIsMapExplorePopup(false)}
          isExternalCloseFunc={isExternalCloseFunc}
          isFixed={false}
          // isImmediate={true}
        >
          <MapExploreByProfilePostPopupBody
            snsPost={snsPost}
            funcPrevButton={() => {
              setIsExternalCloseFunc(true);
            }}
          />
        </BottomFullScreenSheetLayout>
      )}
    </>
  );
};

export default MapExploreByProfilePostPopup;
