import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import { activePostSelectMapContentPopupInfoAtom } from 'states/PostAtom';
import PostSelectMapContentPopupBody from './PostSelectMapContentPopupBody';

const PostSelectMapContentPopup: React.FC = () => {
  const activePostSelectMapContentPopupInfo = useRecoilValue(
    activePostSelectMapContentPopupInfoAtom,
  );

  const resetActivePostSelectMapContentPopupInfo = useResetRecoilState(
    activePostSelectMapContentPopupInfoAtom,
  );
  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSheetLayout
          isOpen={activePostSelectMapContentPopupInfo.isActive}
          onClose={() => resetActivePostSelectMapContentPopupInfo()}
          heightNum={
            170 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          {activePostSelectMapContentPopupInfo.latitude &&
            activePostSelectMapContentPopupInfo.longitude && (
              <PostSelectMapContentPopupBody
                latitude={activePostSelectMapContentPopupInfo.latitude}
                longitude={activePostSelectMapContentPopupInfo.longitude}
                address={activePostSelectMapContentPopupInfo.address}
                buildName={activePostSelectMapContentPopupInfo.buildName}
                onClickFunc={activePostSelectMapContentPopupInfo.onClickFunc}
                onClose={() => setIsExternalCloseFunc(true)}
              />
            )}
        </BottomSheetLayout>
      ) : (
        <>
          {activePostSelectMapContentPopupInfo.isActive && (
            <RoundSquareCenterPopupLayout
              onClose={() => resetActivePostSelectMapContentPopupInfo()}
              popupOverLayContainerStyle={{ zIndex: '2000' }}
              popupWrapStyle={{ height: '180px', width: '300px' }}
            >
              {activePostSelectMapContentPopupInfo.latitude &&
                activePostSelectMapContentPopupInfo.longitude && (
                  <PostSelectMapContentPopupBody
                    latitude={activePostSelectMapContentPopupInfo.latitude}
                    longitude={activePostSelectMapContentPopupInfo.longitude}
                    address={activePostSelectMapContentPopupInfo.address}
                    buildName={activePostSelectMapContentPopupInfo.buildName}
                    onClickFunc={
                      activePostSelectMapContentPopupInfo.onClickFunc
                    }
                    onClose={() => resetActivePostSelectMapContentPopupInfo()}
                  />
                )}
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostSelectMapContentPopup;
