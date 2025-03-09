import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import ProfileOtherAccountPopupBody from 'components/profile/profileaccount/ProfileOtherAccountPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activeProfileAccountPopupInfoAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

const ProfileOtherAccountPopup: React.FC = () => {
  const [activeProfileAccountPopupInfo, setActiveProfileAccountPopupInfo] =
    useRecoilState(activeProfileAccountPopupInfoAtom);

  const { windowWidth } = useWindowSize();

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
        // <PopupLayout
        //   setIsPopup={setIsActiveProfileAccountPopup}
        //   popupWrapStyle={{ height: 'auto' }}
        // >
        //   <SettingPopupWrap
        //     onClick={(e) => {
        //       e.stopPropagation();
        //     }}
        //   >
        //     <ProfileOtherAccountPopupBody />
        //   </SettingPopupWrap>
        // </PopupLayout>
        <BottomSheetLayout
          isOpen={activeProfileAccountPopupInfo.isActive}
          isExternalCloseFunc={isExternalCloseFunc}
          onClose={() =>
            setActiveProfileAccountPopupInfo({
              isActive: false,
              userId: '',
              username: '',
            })
          }
          heightNum={
            290 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
        >
          <SettingPopupWrap
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ProfileOtherAccountPopupBody
              userId={activeProfileAccountPopupInfo.userId}
              username={activeProfileAccountPopupInfo.username}
              onClose={() => setIsExternalCloseFunc(true)}
            />
          </SettingPopupWrap>
        </BottomSheetLayout>
      )}
    </>
  );
};

const SettingPopupWrap = styled.div`
  bottom: 0;
  height: auto;

  padding-bottom: 50px;
  width: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
  z-index: 10;
`;

export default ProfileOtherAccountPopup;
