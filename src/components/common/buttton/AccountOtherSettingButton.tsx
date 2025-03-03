import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import ProfileOtherAccountPopupBody from 'components/profile/profileaccount/ProfileOtherAccountPopupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { activeProfileAccountPopupInfoAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

interface AccountOtherSettingButtonProps {
  userId: string;
  username: string;
}

const AccountOtherSettingButton: React.FC<AccountOtherSettingButtonProps> = ({
  userId,
  username,
}) => {
  const [activeProfileAccountPopupInfo, setActiveProfileAccountPopupInfo] =
    useRecoilState(activeProfileAccountPopupInfoAtom);

  const AccountSettingButtonRef = useRef<HTMLDivElement>(null);

  const { windowWidth } = useWindowSize();
  return (
    <>
      <AccountSettingButtonWrap
        ref={AccountSettingButtonRef}
        onClick={() =>
          setActiveProfileAccountPopupInfo({
            isActive: true,
            userId: userId,
            username: username,
          })
        }
      >
        <SettingVerticalDotIcon />
      </AccountSettingButtonWrap>
      {activeProfileAccountPopupInfo.isActive &&
        windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM &&
        AccountSettingButtonRef.current && (
          <>
            <ContextMenuPopup
              contextMenuRef={AccountSettingButtonRef.current}
              onClose={() =>
                setActiveProfileAccountPopupInfo({
                  userId: '',
                  username: '',
                  isActive: false,
                })
              }
            >
              <ProfileOtherAccountPopupBodyWrap>
                <ProfileOtherAccountPopupBody
                  userId={userId}
                  username={username}
                  onClose={() =>
                    setActiveProfileAccountPopupInfo({
                      isActive: false,
                      username: '',
                      userId: '',
                    })
                  }
                />
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
