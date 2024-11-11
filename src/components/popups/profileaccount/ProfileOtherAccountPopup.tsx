import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import PopupLayout from 'components/layouts/PopupLayout';
import ProfileOtherAccountPopupBody from 'components/profile/profileaccount/ProfileOtherAccountPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveProfileAccountPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

const ProfileOtherAccountPopup: React.FC = () => {
  const setIsActiveProfileAccountPopup = useSetRecoilState(
    isActiveProfileAccountPopupAtom,
  );

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
        <PopupLayout
          setIsPopup={setIsActiveProfileAccountPopup}
          popupWrapStyle={{ height: 'auto' }}
        >
          <SettingPopupWrap
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ProfileOtherAccountPopupBody />
          </SettingPopupWrap>
        </PopupLayout>
      )}
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const SettingPopupWrap = styled.div`
  bottom: 0;
  height: auto;

  margin-top: 50px;
  padding-bottom: 50px;
  width: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
  z-index: 10;
`;

export default ProfileOtherAccountPopup;
