import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';
import { NOTIFICATION_LIST_PATH } from 'const/PathConst';
import {
  getLastNotificationReadAt,
  getNotificationMsgHashMapByLocalStorage,
  saveNotificationMsgHashMapByLocalStorage,
} from 'global/util/NotificationUtil';
import { QueryStateNotificationMsg } from 'hook/queryhook/QueryStateNotificationMsg';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as NotificationActiveIcon } from 'assets/images/icon/svg/NotificationActiveIcon.svg';
import { ReactComponent as NotificationNotActiveIcon } from 'assets/images/icon/svg/NotificationNotActiveIcon.svg';
import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import HeaderLayout from 'components/layouts/HeaderLayout';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { getMyAccountSettingInfo } from 'global/util/MyAccountSettingUtil';
import { isActiveMsgBlockHiddenManagePopupAtom } from 'states/MsgInboxAtom';
import MsgBlockHiddenManagePopupBody from '../popup/MsgBlockHiddenManagePopupBody';

const MessageInboxHeader: React.FC = () => {
  const navigate = useNavigate();
  const msgInboxSettingRef = useRef<HTMLDivElement>(null);
  const [
    isActiveMsgBlockHiddenManagePopup,
    setIsActiveMsgBlockHiddenManagePopup,
  ] = useRecoilState(isActiveMsgBlockHiddenManagePopupAtom);
  const myAccountSettingInfo = getMyAccountSettingInfo();

  const onClickPopup = () => {
    setIsActiveMsgBlockHiddenManagePopup(true);
  };

  const { data: lastNotificationList } = QueryStateNotificationMsg(
    getLastNotificationReadAt(),
  );

  const [hasNotification, setHasNotification] = useState<boolean>(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (lastNotificationList) {
      saveNotificationMsgHashMapByLocalStorage(lastNotificationList);
    }

    const notificationHashMap = getNotificationMsgHashMapByLocalStorage();

    setHasNotification(
      Array.from(notificationHashMap.entries()).some(
        (value) => value[1].isRead === false,
      ),
    );
  }, [lastNotificationList]);

  return (
    <>
      <MessageInboxHeaderContainer>
        <HeaderLayout>
          <MessageInboxHeaderWrap>
            <ProfileNameWrap>
              <ProfileNameDiv>{myAccountSettingInfo.username}</ProfileNameDiv>
            </ProfileNameWrap>
            <MessageSettingWrap>
              <NotificationTab onClick={() => navigate(NOTIFICATION_LIST_PATH)}>
                {hasNotification ? (
                  <NotificationActiveIcon />
                ) : (
                  <NotificationNotActiveIcon />
                )}
              </NotificationTab>
              <SettingButtonWrap>
                <SettingButton onClick={onClickPopup} ref={msgInboxSettingRef}>
                  <SettingVerticalDotIcon />
                </SettingButton>
                {windowSize.width > MEDIA_MOBILE_MAX_WIDTH_NUM &&
                  isActiveMsgBlockHiddenManagePopup &&
                  msgInboxSettingRef.current && (
                    <ContextMenuPopup
                      contextMenuRef={msgInboxSettingRef.current}
                      setIsActive={setIsActiveMsgBlockHiddenManagePopup}
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
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
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
  font: ${({ theme }) => theme.fontSizes.Headline2};
  margin: auto 0px;
`;

const MessageSettingWrap = styled.div`
  display: flex;
  gap: 10px;
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

const NotificationTab = styled.div`
  cursor: pointer;
  display: flex;
  margin: auto 0px;
`;

export default MessageInboxHeader;
