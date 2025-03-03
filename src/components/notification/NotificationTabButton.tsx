import { ReactComponent as NotificationActiveIcon } from 'assets/images/icon/svg/NotificationActiveIcon.svg';
import { ReactComponent as NotificationNotActiveIcon } from 'assets/images/icon/svg/NotificationNotActiveIcon.svg';
import { NOTIFICATION_LIST_PATH } from 'const/PathConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { useSnsNotificationHookByIndexedDb } from 'hook/db/useSnsNotifcationHookByIndexedDb';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NotificationTabButton: React.FC = () => {
  const { hasUnreadNotifications } = useSnsNotificationHookByIndexedDb();

  const navigate = useNavigate();
  return (
    <NotificationTab
      onClick={() => stackRouterPush(navigate, NOTIFICATION_LIST_PATH)}
    >
      {hasUnreadNotifications ? (
        <NotificationActiveIcon />
      ) : (
        <NotificationNotActiveIcon />
      )}
    </NotificationTab>
  );
};

const NotificationTab = styled.div`
  cursor: pointer;
  display: flex;
  margin: auto 0px;
`;

export default NotificationTabButton;
