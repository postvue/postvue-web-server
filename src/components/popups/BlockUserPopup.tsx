import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import BlockUserPopupBody from 'components/profile/blockuser/BlockUserPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActiveProfileBlockPopupAtom } from '../../states/ProfileAtom';

interface BlockUserPopupProps {
  userInfo: { username: string; userId: string };
  isBlocked: boolean;
  setIsBlocked?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingPopup?: React.Dispatch<React.SetStateAction<boolean>>;
  isFixed?: boolean;
}
const BlockUserPopup: React.FC<BlockUserPopupProps> = ({
  userInfo,
  isBlocked,
  setIsBlocked,
  setIsSettingPopup,
  isFixed = true,
}) => {
  const [isActiveProfileBlock, setIsActiveProfileBlock] = useRecoilState(
    isActiveProfileBlockPopupAtom,
  );

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsActiveProfileBlock}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={popupWrapStyle}
        //   hasTransparentOverLay={hasTransparentOverLay}
        //   popupOverLayContainerStyle={{ zIndex: '2000' }}
        //   hasFixedActive={true}
        // >
        //   <BlockUserPopupBody
        //     userInfo={userInfo}
        //     isBlocked={isBlocked}
        //     setIsBlocked={setIsBlocked}
        //     setIsSettingPopup={setIsSettingPopup}
        //   />
        // </PopupLayout>
        <BottomSheetLayout
          isFixed={isFixed}
          isOpen={isActiveProfileBlock}
          onClose={() => setIsActiveProfileBlock(false)}
          heightNum={350}
        >
          <BlockUserPopupBody
            userInfo={userInfo}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            setIsSettingPopup={setIsSettingPopup}
          />
        </BottomSheetLayout>
      ) : (
        <>
          {isActiveProfileBlock && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsActiveProfileBlock(false)}
              popupWrapStyle={{ height: '350px', width: '500px' }}
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
        </>
      )}
      {isActiveProfileBlock && <MyAccountSettingInfoState />}
    </>
  );
};

export default BlockUserPopup;
