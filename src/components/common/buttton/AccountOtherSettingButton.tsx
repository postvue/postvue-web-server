import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import ProfileOtherAccountPopupBody from 'components/profile/profileaccount/ProfileOtherAccountPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isActiveProfileAccountPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';
import WindowResizeSenceComponent from '../container/WindowResizeSenseComponent';

const AccountOtherSettingButton: React.FC = () => {
  const [isActiveProfileAccountPopup, setIsActiveProfileAccountPopup] =
    useRecoilState(isActiveProfileAccountPopupAtom);

  const AccountSettingButtonRef = useRef<HTMLDivElement>(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  return (
    <>
      <AccountSettingButtonWrap
        ref={AccountSettingButtonRef}
        onClick={() => setIsActiveProfileAccountPopup(true)}
      >
        <SettingVerticalDotIcon />
      </AccountSettingButtonWrap>
      {isActiveProfileAccountPopup &&
        windowSize.width > MEDIA_MOBILE_MAX_WIDTH_NUM &&
        AccountSettingButtonRef.current && (
          <>
            <ContextMenuPopup
              contextMenuRef={AccountSettingButtonRef.current}
              setIsActive={setIsActiveProfileAccountPopup}
            >
              <ProfileOtherAccountPopupBodyWrap>
                <ProfileOtherAccountPopupBody />
              </ProfileOtherAccountPopupBodyWrap>
            </ContextMenuPopup>
          </>
        )}
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const AccountSettingButtonWrap = styled.div`
  display: flex;
  margin: auto 0px;
  position: relative;
`;

const ProfileOtherAccountPopupBodyWrap = styled.div`
  padding: 10px 0;
`;

export default AccountOtherSettingButton;
