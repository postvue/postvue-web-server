import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import {
  NOTIFICATION_CONTENT_TEXT_TYPE,
  POST_CLIP_NOTIFICATION_TYPE,
  POST_COMMENT_NOTIFICATION_TYPE,
  POST_LIKE_NOTIFICATION_TYPE,
  USER_FOLLOWER_NOTIFICATION_TYPE,
} from 'const/NotificationConst';
import { PROFILE_LIST_PATH } from 'const/PathConst';
import { NotificationMsgWsSub } from 'global/interface/notification';
import { convertDiffrenceDateTime } from 'global/util/DateTimeUtil';
import {
  getLastNotificationReadAt,
  getNotificationMsgHashMapByLocalStorage,
  readNotificationMsgByLocalStorage,
  saveNotificationMsgHashMapByLocalStorage,
} from 'global/util/NotificationUtil';
import { QueryStateNotificationMsg } from 'hook/queryhook/QueryStateNotificationMsg';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: lastNotificationList } = QueryStateNotificationMsg(
    getLastNotificationReadAt(),
  );
  const [unreadNotificationList, setUnreadNotificationList] = useState<
    NotificationMsgWsSub[]
  >([]);
  const [readNotificationList, setReadNotificationList] = useState<
    NotificationMsgWsSub[]
  >([]);

  useEffect(() => {
    if (lastNotificationList) {
      saveNotificationMsgHashMapByLocalStorage(lastNotificationList);
    }

    const notificationHashMap = getNotificationMsgHashMapByLocalStorage();

    setUnreadNotificationList(
      Array.from(notificationHashMap.entries())
        .filter(([_, value]) => value.isRead === false)
        .map((value) => value[1]),
    );

    setReadNotificationList(
      Array.from(notificationHashMap.entries())
        .filter(([_, value]) => value.isRead === true)
        .map((value) => value[1]),
    );

    readNotificationMsgByLocalStorage();
  }, [lastNotificationList]);

  const onClickNotificationMsg = (notificationMsg: NotificationMsgWsSub) => {
    switch (notificationMsg.notificationType) {
      case POST_LIKE_NOTIFICATION_TYPE:
        navigate(`/${notificationMsg.userId}/${notificationMsg.postId}`);
        break;
      case POST_CLIP_NOTIFICATION_TYPE:
        navigate(`/${notificationMsg.userId}/${notificationMsg.postId}`);
        break;
      case POST_COMMENT_NOTIFICATION_TYPE:
        navigate(`/${notificationMsg.userId}/${notificationMsg.postId}`);
        break;
      case USER_FOLLOWER_NOTIFICATION_TYPE:
        navigate(
          `${PROFILE_LIST_PATH}/${notificationMsg.notificationUsername}`,
        );
        break;
      default:
        break;
    }
  };

  return (
    <AppBaseTemplate>
      <PrevButtonHeaderHeader titleName={'알림'} />
      <NotificationPageBodyContainer>
        {unreadNotificationList.length > 0 && (
          <NotificationPageBodyUnreadContainer>
            <NotificationPageBodyUnreadTitleWrap>
              <NotificationPageBodyUnreadTitle>
                읽지 않음
              </NotificationPageBodyUnreadTitle>
            </NotificationPageBodyUnreadTitleWrap>
            <NotificationUnreadContentListContainer>
              {unreadNotificationList.map((notification, key) => (
                <NotificationContentWrap
                  key={key}
                  onClick={() => onClickNotificationMsg(notification)}
                >
                  <NotificationContentImg
                    src={notification.notificationUserProfilePath}
                  />
                  <NotificationContentMsg>
                    {notification.notificationContents.map(
                      (notificationContent, nCKey) => {
                        if (
                          notificationContent.snsNotificationContentType ===
                          NOTIFICATION_CONTENT_TEXT_TYPE
                        ) {
                          return (
                            <NotificatiNotificationContentText key={nCKey}>
                              {notificationContent.snsNotificationContent}
                            </NotificatiNotificationContentText>
                          );
                        }
                      },
                    )}
                    <NotificationUnreadContentNotifiedAt>
                      {` · ${convertDiffrenceDateTime(notification.notifiedAt)}`}
                    </NotificationUnreadContentNotifiedAt>
                  </NotificationContentMsg>
                </NotificationContentWrap>
              ))}
            </NotificationUnreadContentListContainer>
          </NotificationPageBodyUnreadContainer>
        )}
      </NotificationPageBodyContainer>

      {readNotificationList.length > 0 && (
        <NotificationPageBodyReadContainer>
          <NotificationPageBodyReadTitleWrap>
            <NotificationPageBodyReadTitle>읽음</NotificationPageBodyReadTitle>
          </NotificationPageBodyReadTitleWrap>
          <NotificationReadContentListContainer>
            {readNotificationList.map((notification, key) => (
              <NotificationContentWrap
                key={key}
                onClick={() => onClickNotificationMsg(notification)}
              >
                <NotificationContentImg
                  src={notification.notificationUserProfilePath}
                />
                <NotificationContentMsg>
                  {notification.notificationContents.map(
                    (notificationContent, nCKey) => {
                      if (
                        notificationContent.snsNotificationContentType ===
                        NOTIFICATION_CONTENT_TEXT_TYPE
                      ) {
                        return (
                          <NotificatiNotificationContentText key={nCKey}>
                            {notificationContent.snsNotificationContent}
                          </NotificatiNotificationContentText>
                        );
                      }
                    },
                  )}
                  <NotificationUnreadContentNotifiedAt>
                    {` · ${convertDiffrenceDateTime(notification.notifiedAt)}`}
                  </NotificationUnreadContentNotifiedAt>
                </NotificationContentMsg>
              </NotificationContentWrap>
            ))}
          </NotificationReadContentListContainer>
        </NotificationPageBodyReadContainer>
      )}
    </AppBaseTemplate>
  );
};

const ProfileImgSize = 51;

const NotificationPageBodyContainer = styled.div`
  padding-top: ${({ theme }) => theme.systemSize.header.height};
`;

const NotificationPageBodyUnreadContainer = styled.div``;

const NotificationPageBodyUnreadTitleWrap = styled.div`
  padding: 26px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 11px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const NotificationPageBodyUnreadTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const NotificationUnreadContentListContainer = styled.div`
  display: flex;
  gap: 14px;
  flex-flow: column;
`;

const NotificationContentWrap = styled.div`
  display: flex;
  gap: 13px;
  padding: 0px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const NotificationContentImg = styled.img`
  // @REFER: 51px 따로 스타일로 관리
  width: ${ProfileImgSize}px;
  height: ${ProfileImgSize}px;
  border-radius: 30px;
`;

const NotificationContentMsg = styled.div`
  margin: auto 0;
  width: calc(95% - ${ProfileImgSize}px);
`;

const NotificatiNotificationContentText = styled.span`
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

const NotificationUnreadContentNotifiedAt = styled.span`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey4};
`;

const NotificationPageBodyReadContainer = styled.div``;

const NotificationReadContentListContainer = styled(
  NotificationUnreadContentListContainer,
)``;

const NotificationPageBodyReadTitleWrap = styled(
  NotificationPageBodyUnreadTitleWrap,
)``;

const NotificationPageBodyReadTitle = styled(NotificationPageBodyUnreadTitle)``;

export default NotificationPage;
