import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_NOTIFICATION_MSG,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { NotificationMsgWsSub } from 'global/interface/notification';
import { isISODate } from 'global/util/DateTimeUtil';
import { getNotificationMsgList } from 'services/notification/getNotificationMsgList';

export const QueryStateNotificationMsg = (
  lastNotificationReadAt: string,
): UseQueryResult<NotificationMsgWsSub[], AxiosError<unknown, any>> => {
  return useQuery<NotificationMsgWsSub[], AxiosError>({
    queryKey: [QUERY_STATE_NOTIFICATION_MSG],
    queryFn: () => getNotificationMsgList(lastNotificationReadAt),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isISODate(lastNotificationReadAt),
  });
};
