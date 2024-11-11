import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isActivPostComposePopupAtom } from 'states/PostComposeAtom';
import PopupLayout from '../../layouts/PopupLayout';
import PostComposePopupBody from './PostComposePopupBody';

const popupWrapStyle: React.CSSProperties = {
  height: 'auto',
};

const PostComposePopup: React.FC = () => {
  const setIsActivePostComposePopup = useSetRecoilState(
    isActivPostComposePopupAtom,
  );

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsActivePostComposePopup}
          isTouchScrollBar={true}
          popupWrapStyle={popupWrapStyle}
        >
          <PostComposePopupBody />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsActivePostComposePopup}
          popupWrapStyle={{ height: '250px', width: '400px' }}
        >
          <PostComposePopupBody />
        </RoundSquareCenterPopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

export default PostComposePopup;
