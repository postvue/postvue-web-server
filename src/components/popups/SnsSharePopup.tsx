import PopupLayout from 'components/layouts/PopupLayout';
import React, { useState } from 'react';
import { SetterOrUpdater } from 'recoil';

import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import SnsShareBody from './snsshare/SnsShareBody';

//@REFER: 태그 관련 상태관리 삭제 하삼

interface SnsSharePopupProps {
  shareLink: string;
  setIsSharePopup: SetterOrUpdater<boolean>;
}
const SnsSharePopup: React.FC<SnsSharePopupProps> = ({
  shareLink,
  setIsSharePopup,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsSharePopup}
          isTouchScrollBar={true}
          popupWrapStyle={PopupWrapStyle}
          hasFixedActive={true}
        >
          <SnsShareBody shareLink={shareLink} />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsSharePopup}
          popupWrapStyle={{ height: '500px', width: '500px' }}
        >
          <SnsShareBody shareLink={shareLink} />
        </RoundSquareCenterPopupLayout>
      )}
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const PopupWrapStyle: React.CSSProperties = {
  height: '85%',
};

export default SnsSharePopup;
