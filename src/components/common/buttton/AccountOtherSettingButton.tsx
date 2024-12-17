import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import ProfileOtherAccountPopupBody from 'components/profile/profileaccount/ProfileOtherAccountPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { isActiveProfileAccountPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

const AccountOtherSettingButton: React.FC = () => {
  const [isActiveProfileAccountPopup, setIsActiveProfileAccountPopup] =
    useRecoilState(isActiveProfileAccountPopupAtom);

  const AccountSettingButtonRef = useRef<HTMLDivElement>(null);

  const { windowWidth } = useWindowSize();
  return (
    <>
      <AccountSettingButtonWrap
        ref={AccountSettingButtonRef}
        onClick={() => setIsActiveProfileAccountPopup(true)}
      >
        <SettingVerticalDotIcon />
      </AccountSettingButtonWrap>
      {isActiveProfileAccountPopup &&
        windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM &&
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
