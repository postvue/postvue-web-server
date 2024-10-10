import { ReactComponent as SettingVerticalDotIcon } from 'assets/images/icon/svg/SettingVerticalDotIcon.svg';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import { NOTIFICATION_LIST_PATH } from 'const/PathConst';
import {
  getLastNotificationReadAt,
  getNotificationMsgHashMapByLocalStorage,
  saveNotificationMsgHashMapByLocalStorage,
} from 'global/util/NotificationUtil';
import { QueryStateNotificationMsg } from 'hook/queryhook/QueryStateNotificationMsg';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { isFolloManagePopupByMsgInboxAtom } from '../../../states/MsgInboxAtom';

import { ReactComponent as NotificationActiveIcon } from 'assets/images/icon/svg/NotificationActiveIcon.svg';
import { ReactComponent as NotificationNotActiveIcon } from 'assets/images/icon/svg/NotificationNotActiveIcon.svg';

const MessageInboxHeader: React.FC = () => {
  const navigate = useNavigate();
  const setIsFolloManagePopupByMsgInbox = useSetRecoilState(
    isFolloManagePopupByMsgInboxAtom,
  );

  const onClickPopup = () => {
    setIsFolloManagePopupByMsgInbox(true);
  };

  const { data: lastNotificationList } = QueryStateNotificationMsg(
    getLastNotificationReadAt(),
  );

  const [hasNotification, setHasNotification] = useState<boolean>(false);

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
    <MessageInboxHeaderContainer>
      <MessageInboxHeaderWrap>
        <ProfileNameWrap>
          <ProfileNameDiv>changminkim-329</ProfileNameDiv>
        </ProfileNameWrap>
        <MessageSettingWrap>
          <NotificationTab onClick={() => navigate(NOTIFICATION_LIST_PATH)}>
            {hasNotification ? (
              <NotificationActiveIcon />
            ) : (
              <NotificationNotActiveIcon />
            )}
          </NotificationTab>
          {/* <MessageWriteButtonWrap>
            <MessageWriteButton>
              <MessageWriteIcon
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7 7.00012H6C5.46957 7.00012 4.96086 7.21084 4.58579 7.58591C4.21071 7.96098 4 8.46969 4 9.00012V18.0001C4 18.5306 4.21071 19.0393 4.58579 19.4143C4.96086 19.7894 5.46957 20.0001 6 20.0001H15C15.5304 20.0001 16.0391 19.7894 16.4142 19.4143C16.7893 19.0393 17 18.5306 17 18.0001V17.0001M16 5.00012L19 8.00012M20.385 6.58511C20.7788 6.19126 21.0001 5.65709 21.0001 5.10011C21.0001 4.54312 20.7788 4.00895 20.385 3.61511C19.9912 3.22126 19.457 3 18.9 3C18.343 3 17.8088 3.22126 17.415 3.61511L9 12.0001V15.0001H12L20.385 6.58511Z"
                  stroke="#26292C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </MessageWriteIcon>
            </MessageWriteButton>
          </MessageWriteButtonWrap> */}
          <SettingButtonWrap>
            <SettingButton onClick={onClickPopup}>
              <SettingVerticalDotIcon />
            </SettingButton>
          </SettingButtonWrap>
        </MessageSettingWrap>
      </MessageInboxHeaderWrap>
      <BoundaryStickBar />
    </MessageInboxHeaderContainer>
  );
};

const MessageInboxHeaderContainer = styled.div``;
const MessageInboxHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px 11px 20px;
  height: 35px;
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

const MessageWriteButtonWrap = styled.div`
  display: flex;
`;
const MessageWriteButton = styled.div`
  display: flex;
`;
const MessageWriteIcon = styled.svg`
  margin: auto 0;
`;

const SettingButtonWrap = styled.div`
  display: flex;
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
