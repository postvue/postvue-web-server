import { ReactComponent as EmptyNotificationIcon } from 'assets/images/icon/svg/empty/EmptyNotificationIcon.svg';
import { ACCOUNT_NOT_PROFILE_IMG_PATH } from 'const/AccountConst';
import {
  NOTIFICATION_CONTENT_TEXT_TYPE,
  POST_CLIP_NOTIFICATION_TYPE,
  POST_COMMENT_NOTIFICATION_TYPE,
  POST_LIKE_NOTIFICATION_TYPE,
  USER_FOLLOWER_NOTIFICATION_TYPE,
} from 'const/NotificationConst';
import { PROFILE_ACCOUNT_ROUTE_PATH } from 'const/PathConst';
import {
  POST_DETAIL_POPUP_PARAM,
  POST_DETAIL_POST_ID_PARAM,
  POST_DETAIL_PROFILE_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { SnsNotification } from 'global/db/db';
import { convertDiffrenceDateTime } from 'global/util/DateTimeUtil';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import React, { useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useInView } from 'react-spring';
import styled from 'styled-components';
import theme from 'styles/theme';

const NotificationPageBody: React.FC = () => {
  const navigate = useNavigate();

  // const [unreadNotificationList, setUnreadNotificationList] = useState<
  //   NotificationMsgWsSub[]
  // >([]);
  // const [readNotificationList, setReadNotificationList] = useState<
  //   NotificationMsgWsSub[]
  // >([]);

  // const notificationHashMapString = useLocalStorageListener(
  //   NOTIFICATION_MSG_LIST,
  // );

  const {
    readNotificationMsgList,
    notifications,
    loadMoreNotifications,
    hasMore,
  } = useSnsNotificationHookByIndexedDb();

  const [ref, inView] = useInView();

  // 사용자가 마지막 요소를 보면 추가 로드 실행
  React.useEffect(() => {
    if (inView && hasMore) {
      loadMoreNotifications();
    }
  }, [inView, hasMore, loadMoreNotifications]);

  useEffect(() => {
    readNotificationMsgList();
  }, [notifications]);

  // useEffect(() => {
  //   if (!notificationHashMapString) return;
  // const notificationMsgHashMap: Map<string, NotificationMsgWsSub> =
  //   convertNotificationMspHash(notificationHashMapString);

  // setUnreadNotificationList(
  //   Array.from(notificationMsgHashMap.entries())
  //     .filter(([, value]) => value.isRead === false)
  //     .map((value) => value[1]),
  // );

  // setReadNotificationList(
  //   Array.from(notificationMsgHashMap.entries())
  //     .filter(([, value]) => value.isRead === true)
  //     .map((value) => value[1]),
  // );

  // readNotificationMsgByLocalStorage();
  // readNotificationMsgList();

  // return () => {
  //   setUnreadNotificationList([]);
  //   setReadNotificationList([]);
  // };
  // }, [notificationHashMapString]);

  const onClickNotificationMsg = (notificationMsg: SnsNotification) => {
    // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
    const searchParams = new URLSearchParams(location.search);

    switch (notificationMsg.notificationType) {
      case POST_LIKE_NOTIFICATION_TYPE:
        searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
        searchParams.set(POST_DETAIL_POST_ID_PARAM, notificationMsg.postId);
        searchParams.set(POST_DETAIL_PROFILE_PARAM, notificationMsg.userId);

        // 새로운 쿼리 파라미터가 포함된 URL 생성
        navigate(`${location.pathname}?${searchParams.toString()}`, {
          replace: false,
          state: { isDetailPopup: true },
        });
        break;
      case POST_CLIP_NOTIFICATION_TYPE:
        searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
        searchParams.set(POST_DETAIL_POST_ID_PARAM, notificationMsg.postId);
        searchParams.set(POST_DETAIL_PROFILE_PARAM, notificationMsg.userId);
        navigate(`${location.pathname}?${searchParams.toString()}`, {
          replace: false,
          state: { isDetailPopup: true },
        });
        break;
      case POST_COMMENT_NOTIFICATION_TYPE:
        searchParams.set(POST_DETAIL_POPUP_PARAM, TRUE_PARAM);
        searchParams.set(POST_DETAIL_POST_ID_PARAM, notificationMsg.postId);
        searchParams.set(POST_DETAIL_PROFILE_PARAM, notificationMsg.userId);
        navigate(`${location.pathname}?${searchParams.toString()}`, {
          replace: false,
          state: { isDetailPopup: true },
        });
        break;
      case USER_FOLLOWER_NOTIFICATION_TYPE:
        stackRouterPush(
          navigate,
          generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
            username: notificationMsg.notificationUsername,
          }),
          {
            isShowInitBottomNavBar: true,
          } as RoutePushEventDateInterface,
        );
        break;
      default:
        break;
    }
  };

  return (
    <NotificationPageBodyContainer>
      {notifications.length > 0 && (
        <div>
          {notifications.filter((v) => !v.isRead).length > 0 && (
            <NotificationPageBodyUnreadContainer>
              <NotificationPageBodyUnreadTitleWrap>
                <NotificationPageBodyUnreadTitle>
                  읽지 않음
                </NotificationPageBodyUnreadTitle>
              </NotificationPageBodyUnreadTitleWrap>
              <NotificationUnreadContentListContainer>
                {notifications
                  .filter((v) => !v.isRead)
                  .map((notification, key) => (
                    <NotificationContentWrap
                      id={'notification_' + notification.id}
                      key={key}
                      onClick={() => onClickNotificationMsg(notification)}
                    >
                      <NotificationContentImg
                        src={notification.notificationUserProfilePath}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // 무한 루프 방지
                          target.src = ACCOUNT_NOT_PROFILE_IMG_PATH;
                        }}
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
          {notifications.filter((v) => v.isRead).length > 0 && (
            <NotificationPageBodyReadContainer>
              <NotificationPageBodyReadTitleWrap>
                <NotificationPageBodyReadTitle>
                  읽음
                </NotificationPageBodyReadTitle>
              </NotificationPageBodyReadTitleWrap>
              <NotificationReadContentListContainer>
                {notifications
                  .filter((v) => v.isRead)
                  .map((notification, key) => (
                    <NotificationContentWrap
                      id={'notification_' + notification.id}
                      key={key}
                      onClick={() => onClickNotificationMsg(notification)}
                    >
                      <NotificationContentImg
                        src={notification.notificationUserProfilePath}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // 무한 루프 방지
                          target.src = ACCOUNT_NOT_PROFILE_IMG_PATH;
                        }}
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
        </div>
      )}
      {notifications.length <= 0 && (
        <NotAlarmWrap>
          <NotAlarImg>
            <EmptyNotificationIcon />
          </NotAlarImg>
          <NotAlarmTitle>알림이 비어있습니다.</NotAlarmTitle>
        </NotAlarmWrap>
      )}
      <InViewComponent ref={ref} />
    </NotificationPageBodyContainer>
  );
};

const ProfileImgSize = 51;

const NotificationPageBodyContainer = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
  }
  position: relative;
  min-height: calc(100dvh - ${theme.systemSize.header.height});
`;

const NotificationPageBodyUnreadContainer = styled.div`
  padding-top: env(safe-area-inset-top);
`;

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
  cursor: pointer;
`;

const NotificationContentImg = styled.img`
  // @REFER: 51px 따로 스타일로 관리
  width: ${ProfileImgSize}px;
  height: ${ProfileImgSize}px;
  border-radius: 30px;
  object-fit: cover;
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
  display: inline-block;
`;

const NotificationPageBodyReadContainer = styled.div`
  padding-top: env(safe-area-inset-top);
`;

const NotificationReadContentListContainer = styled(
  NotificationUnreadContentListContainer,
)``;

const NotificationPageBodyReadTitleWrap = styled(
  NotificationPageBodyUnreadTitleWrap,
)``;

const NotificationPageBodyReadTitle = styled(NotificationPageBodyUnreadTitle)``;

const NotAlarmWrap = styled.div`
  position: absolute;
  top: calc(50% - ${theme.systemSize.header.height});
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column;
`;

const NotAlarImg = styled.div`
  margin: 0 auto;
`;

const NotAlarmTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const InViewComponent = styled.div`
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
`;

export default NotificationPageBody;
