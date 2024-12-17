import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import ProfileOtherAccountPopupBody from 'components/profile/profileaccount/ProfileOtherAccountPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActiveProfileAccountPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

const ProfileOtherAccountPopup: React.FC = () => {
  const [isActiveProfileAccountPopup, setIsActiveProfileAccountPopup] =
    useRecoilState(isActiveProfileAccountPopupAtom);

  const { windowWidth } = useWindowSize();

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
          isOpen={isActiveProfileAccountPopup}
          onClose={() => setIsActiveProfileAccountPopup(false)}
          heightNum={300}
        >
          <SettingPopupWrap
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ProfileOtherAccountPopupBody />
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
