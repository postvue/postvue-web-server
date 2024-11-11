import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isActivPostComposeBySourceUrlPopupAtom } from 'states/PostComposeAtom';
import PopupLayout from '../../layouts/PopupLayout';
import PostComposeBySourceUrlPopupBody from './PostComposeBySourceUrlPopupBody';

const PostComposeBySourceUrlPopup: React.FC = () => {
  const setIsActivePostComposeBySourceUrlPopup = useSetRecoilState(
    isActivPostComposeBySourceUrlPopupAtom,
  );

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsActivePostComposeBySourceUrlPopup}
          isTouchScrollBar={false}
          hasTransparentOverLay={true}
        >
          <PostComposeBySourceUrlPopupBody />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          popupWrapStyle={{
            height: 'calc(100vh - 50px)',
            borderRadius: '20px',
          }}
          setIsPopup={setIsActivePostComposeBySourceUrlPopup}
        >
          <PostComposeBySourceUrlPopupBody />
        </RoundSquareCenterPopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

export default PostComposeBySourceUrlPopup;
