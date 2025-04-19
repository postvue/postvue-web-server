import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import { activePostMapGuideSelectPopupInfoAtom } from 'states/PostAtom';
import PostMapGuideSelectPopupBody from './PostMapGuideSelectPopupBody';

const PostMapGuideSelectPopup: React.FC = () => {
  const activePostMapGuideSelectPopupInfo = useRecoilValue(
    activePostMapGuideSelectPopupInfoAtom,
  );

  const resetActivePostMapGuideSelectPopupInfo = useResetRecoilState(
    activePostMapGuideSelectPopupInfoAtom,
  );
  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isOpen={activePostMapGuideSelectPopupInfo.isActive}
          onClose={() => resetActivePostMapGuideSelectPopupInfo()}
          heightNum={
            280 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          {activePostMapGuideSelectPopupInfo.latitude &&
            activePostMapGuideSelectPopupInfo.longitude && (
              <PostMapGuideSelectPopupBody
                latitude={activePostMapGuideSelectPopupInfo.latitude}
                longitude={activePostMapGuideSelectPopupInfo.longitude}
                address={activePostMapGuideSelectPopupInfo.address}
                buildName={activePostMapGuideSelectPopupInfo.buildName}
                onClose={() => setIsExternalCloseFunc(true)}
              />
            )}
        </BottomSheetLayout>
      ) : (
        <>
          {activePostMapGuideSelectPopupInfo.isActive && (
            <RoundSquareCenterPopupLayout
              onClose={() => resetActivePostMapGuideSelectPopupInfo()}
              popupOverLayContainerStyle={{ zIndex: '2000' }}
              popupWrapStyle={{ height: '300px', width: '300px' }}
            >
              {activePostMapGuideSelectPopupInfo.latitude &&
                activePostMapGuideSelectPopupInfo.longitude && (
                  <PostMapGuideSelectPopupBody
                    latitude={activePostMapGuideSelectPopupInfo.latitude}
                    longitude={activePostMapGuideSelectPopupInfo.longitude}
                    address={activePostMapGuideSelectPopupInfo.address}
                    buildName={activePostMapGuideSelectPopupInfo.buildName}
                    onClose={() => resetActivePostMapGuideSelectPopupInfo()}
                  />
                )}
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostMapGuideSelectPopup;
