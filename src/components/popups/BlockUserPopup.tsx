import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import BlockUserPopupBody from 'components/profile/blockuser/BlockUserPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveProfileBlockPopupAtom } from '../../states/ProfileAtom';
import PopupLayout from '../layouts/PopupLayout';

const popupWrapStyle: React.CSSProperties = {
  height: '55%',
};

interface BlockUserPopupProps {
  userInfo: { username: string; userId: string };
  isBlocked: boolean;
  hasTransparentOverLay?: boolean;
  setIsBlocked?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingPopup?: React.Dispatch<React.SetStateAction<boolean>>;
}
const BlockUserPopup: React.FC<BlockUserPopupProps> = ({
  userInfo,
  isBlocked,
  hasTransparentOverLay = false,
  setIsBlocked,
  setIsSettingPopup,
}) => {
  const setIsActiveProfileBlock = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsActiveProfileBlock}
          isTouchScrollBar={true}
          popupWrapStyle={popupWrapStyle}
          hasTransparentOverLay={hasTransparentOverLay}
          popupOverLayContainerStyle={{ zIndex: '2000' }}
          hasFixedActive={true}
        >
          <BlockUserPopupBody
            userInfo={userInfo}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            setIsSettingPopup={setIsSettingPopup}
          />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsActiveProfileBlock}
          popupWrapStyle={{ height: '400px', width: '500px' }}
          popupOverLayContainerStyle={{ zIndex: '2000' }}
        >
          <BlockUserPopupBody
            userInfo={userInfo}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            setIsSettingPopup={setIsSettingPopup}
          />
        </RoundSquareCenterPopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

export default BlockUserPopup;
