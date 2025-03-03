import React, { useEffect, useState } from 'react';

import useWindowSize from 'hook/customhook/useWindowSize';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import BottomFullScreenSheetLayout from 'components/layouts/BottomFullScreenSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { activeMapScrapPopupAtom } from 'states/ProfileAtom';
import MapExploreByScrapPopupBody from './MapExploreByScrapPopupBody';

const MapExploreByScrapPopup: React.FC = () => {
  const activeMapScrapPopup = useRecoilValue(activeMapScrapPopupAtom);
  const resetActiveMapScrapPopup = useResetRecoilState(activeMapScrapPopupAtom);

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    return () => {
      resetActiveMapScrapPopup();
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
        >
          <MapExploreByScrapPopupBody
            funcPrevButton={() => {
              resetActiveMapScrapPopup();
            }}
            isMobile={false}
            scrapId={activeMapScrapPopup.scrapId}
          />
        </RoundSquareCenterPopupLayout>
      ) : (
        <BottomFullScreenSheetLayout
          isOpen={activeMapScrapPopup.isActive}
          onClose={() => resetActiveMapScrapPopup()}
          isExternalCloseFunc={isExternalCloseFunc}
        >
          <MapExploreByScrapPopupBody
            funcPrevButton={() => {
              setIsExternalCloseFunc(true);
            }}
            scrapId={activeMapScrapPopup.scrapId}
          />
        </BottomFullScreenSheetLayout>
      )}
    </>
  );
};

export default MapExploreByScrapPopup;
