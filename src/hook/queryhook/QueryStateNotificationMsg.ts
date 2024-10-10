import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  QUERY_STATE_NOTIFICATION_MSG,
  SERACH_FAVORITE_TERMS_STALE_TIME,
} from 'const/QueryClientConst';
import { NotificationMsgWsSub } from 'global/interface/notification';
import { getNotificationMsgList } from 'services/notification/getNotificationMsgList';

export const QueryStateNotificationMsg = (
  lastNotificationReadAt: string,
): UseQueryResult<NotificationMsgWsSub[], AxiosError<unknown, any>> => {
  return useQuery<NotificationMsgWsSub[], AxiosError>({
    queryKey: [QUERY_STATE_NOTIFICATION_MSG],
    queryFn: () => getNotificationMsgList(lastNotificationReadAt),
    staleTime: SERACH_FAVORITE_TERMS_STALE_TIME,
  });
};
