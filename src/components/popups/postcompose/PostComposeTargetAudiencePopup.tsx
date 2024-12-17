import React, { useState } from 'react';
import { isActivPostComposeTargetAudiencePopupAtom } from 'states/PostComposeAtom';

import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { useRecoilState } from 'recoil';
import PostComposeTargetAudiencePopupBody from './PostComposeTargetAudiencePopupBody';

interface PostComposeTargetAudiencePopupProps {
  targetAudTabList: {
    tabName: string;
    tabId: number;
  }[];
  targetAudTabId: number;
  setTargetAudTabId: React.Dispatch<React.SetStateAction<number>>;
  hasTransparentOverLay?: boolean;
}

const PostComposeTargetAudiencePopup: React.FC<
  PostComposeTargetAudiencePopupProps
> = ({
  targetAudTabList,
  targetAudTabId,
  setTargetAudTabId,
  hasTransparentOverLay,
}) => {
  const [
    isActivPostComposeTargetAudiencePopup,
    setIsActivPostComposeTargetAudiencePopup,
  ] = useRecoilState(isActivPostComposeTargetAudiencePopupAtom);

  const { windowWidth } = useWindowSize();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsActivPostComposeTargetAudiencePopup}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={popupWrapStyle}
        // >
        //   <PostComposeTargetAudiencePopupBody
        //     targetAudTabId={targetAudTabId}
        //     setTargetAudTabId={setTargetAudTabId}
        //     targetAudTabList={targetAudTabList}
        //   />
        // </PopupLayout>
        <BottomSheetLayout
          isOpen={isActivPostComposeTargetAudiencePopup}
          onClose={() => setIsActivPostComposeTargetAudiencePopup(false)}
          heightNum={250}
          isExternalCloseFunc={isExternalCloseFunc}
          setIsExternalCloseFunc={setIsExternalCloseFunc}
        >
          <PostComposeTargetAudiencePopupBody
            targetAudTabId={targetAudTabId}
            setTargetAudTabId={setTargetAudTabId}
            targetAudTabList={targetAudTabList}
            setIsExternalCloseFunc={setIsExternalCloseFunc}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {isActivPostComposeTargetAudiencePopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActivPostComposeTargetAudiencePopup(false)}
              popupWrapStyle={{ height: '90%' }}
              hasTransparentOverLay={hasTransparentOverLay}
              hasFixedActive={false}
            >
              <PostComposeTargetAudiencePopupBody
                targetAudTabId={targetAudTabId}
                setTargetAudTabId={setTargetAudTabId}
                targetAudTabList={targetAudTabList}
                setIsExternalCloseFunc={setIsExternalCloseFunc}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default PostComposeTargetAudiencePopup;
