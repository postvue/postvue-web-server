import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import SearchTabComponent from 'components/home/header/SearchTabComponent';
import HeaderLayout from 'components/layouts/HeaderLayout';
import NotificationTabButton from 'components/notification/NotificationTabButton';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import { isActiveMsgBlockHiddenManagePopupAtom } from 'states/MsgInboxAtom';
import MsgBlockHiddenManagePopupBody from '../popup/MsgBlockHiddenManagePopupBody';

const MessageInboxHeader: React.FC = () => {
  const navigate = useNavigate();
  const msgInboxSettingRef = useRef<HTMLDivElement>(null);
  const [
    isActiveMsgBlockHiddenManagePopup,
    setIsActiveMsgBlockHiddenManagePopup,
  ] = useRecoilState(isActiveMsgBlockHiddenManagePopupAtom);
  const { data: myAccountSettingInfo, isFetched } = QueryStateMyProfileInfo();

  const onClickPopup = () => {
    setIsActiveMsgBlockHiddenManagePopup(true);
  };

  const { windowWidth } = useWindowSize();

  return (
    <MessageInboxHeaderContainer>
      <HeaderLayout>
        <MessageInboxHeaderWrap>
          <ProfileNameWrap>
            {isFetched && (
              <ProfileNameDiv>
                {/* <ProfileNickname>
                {myAccountSettingInfo?.nickname}.
              </ProfileNickname> */}
                <ProfileUsername>
                  @{myAccountSettingInfo?.username}
                </ProfileUsername>
              </ProfileNameDiv>
            )}
          </ProfileNameWrap>
          <MessageSettingWrap>
            <SearchTabComponent />
            {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM && (
              <NotificationTabButton />
            )}

            <SettingButtonWrap>
              <SettingButton onClick={onClickPopup} ref={msgInboxSettingRef}>
                <SettingVerticalDotIcon />
              </SettingButton>
              {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM &&
                isActiveMsgBlockHiddenManagePopup &&
                msgInboxSettingRef.current && (
                  <ContextMenuPopup
                    contextMenuRef={msgInboxSettingRef.current}
                    onClose={() => setIsActiveMsgBlockHiddenManagePopup(false)}
                  >
                    <MsgBlockHiddenManagePopupBody
                      BlockedHiddenManageContainerStyle={{ margin: '20px' }}
                    />
                  </ContextMenuPopup>
                )}
            </SettingButtonWrap>
          </MessageSettingWrap>
        </MessageInboxHeaderWrap>
      </HeaderLayout>
    </MessageInboxHeaderContainer>
  );
};

const MessageInboxHeaderContainer = styled.div`
  z-index: 150;
  background-color: ${({ theme }) => theme.mainColor.White};
  width: 100%;
`;
const MessageInboxHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.header.paddingLeftRightMargin} 0
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  width: 100%;
`;

const ProfileNameWrap = styled.div`
  display: flex;
`;
const ProfileNameDiv = styled.div`
  margin: auto 0px;
  display: flex;
  gap: 5px;
`;

const ProfileNickname = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline2};
  margin: auto 0px;
`;

const ProfileUsername = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline2};
  color: ${({ theme }) => theme.grey.Grey9};
`;

const MessageSettingWrap = styled.div`
  display: flex;
  gap: 13px;
`;

const SettingButtonWrap = styled.div`
  display: flex;
  position: relative;
`;
const SettingButton = styled.div`
  display: flex;
  margin: auto 0px;
  cursor: pointer;
`;

export default MessageInboxHeader;
