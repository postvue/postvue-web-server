import { NotificationMsgWsSub } from 'global/interface/notification';
import { NOTIFICATION_MSG_LIST_API_PATH } from 'services/appApiPath';
import { NOTIFIED_DATETIME } from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getNotificationMsgList = (
  dateString: string,
): Promise<NotificationMsgWsSub[]> => {
  return optAuthApi
    .get(`${NOTIFICATION_MSG_LIST_API_PATH}?${NOTIFIED_DATETIME}=${dateString}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
