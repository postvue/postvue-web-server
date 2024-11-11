import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isActivePostComplaintPopupAtom } from 'states/PostAtom';
import PopupLayout from '../../layouts/PopupLayout';
import PostComplaintPopupBody from './PostComplaintPopupBody';

const popupWrapStyle: React.CSSProperties = {
  height: 'auto',
};

const PostComplaintPopup: React.FC = () => {
  const setIsActivePostComplaintPopup = useSetRecoilState(
    isActivePostComplaintPopupAtom,
  );

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsActivePostComplaintPopup}
          isTouchScrollBar={true}
          popupWrapStyle={popupWrapStyle}
        >
          <PostComplaintPopupBody />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsActivePostComplaintPopup}
          popupWrapStyle={{ height: '500px', width: '400px' }}
        >
          <PostComplaintPopupBody />
        </RoundSquareCenterPopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

export default PostComplaintPopup;
