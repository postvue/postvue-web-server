import MyAccountSettingInfoState from 'components/common/state/MyAccountSettingInfoState';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import NotificationPageBody from 'components/notification/NotificationPageBody';
import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { NOTIFICATION_TAB_NAME } from 'const/TabConst';
import { convertNotificationAt } from 'global/util/NotificationUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import { QueryStateNotificationMsg } from 'hook/queryhook/QueryStateNotificationMsg';
import React from 'react';

const NotificationPage: React.FC = () => {
  const { latestNotificationAt } = useSnsNotificationHookByIndexedDb();
  const { refetch: refetchNotificationMsg } = QueryStateNotificationMsg(
    convertNotificationAt(latestNotificationAt) || '',
  );

  const { windowWidth } = useWindowSize();

  return (
    <>
      <PageHelmentInfoElement
        title={NOTIFICATION_TAB_NAME}
        ogTitle={NOTIFICATION_TAB_NAME}
        ogUrl={window.location.href}
        ogDescription={NOTIFICATION_TAB_NAME}
      />
      <AppBaseTemplate isAppInsetTopMargin={false}>
        <MyAccountSettingInfoState />
        <PrevButtonHeaderHeader
          titleName={'알림'}
          isActionFunc={windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM}
        />
        {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
          <NotificationPageBody />
        ) : (
          <PullToRefreshComponent
            onRefresh={async () => {
              refetchNotificationMsg();
            }}
          >
            <NotificationPageBody />
          </PullToRefreshComponent>
        )}
      </AppBaseTemplate>
    </>
  );
};

export default NotificationPage;
