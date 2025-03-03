import { NotificationMsgWsSub } from 'global/interface/notification';
import { isValidString } from 'global/util/ValidUtil';
import { NOTIFICATION_MSG_LIST_API_PATH } from 'services/appApiPath';
import { NOTIFIED_DATETIME } from 'services/appApiQueryParam';
import { optAuthApi } from '..';

export const getNotificationMsgList = (
  dateString: string,
): Promise<NotificationMsgWsSub[]> => {
  return optAuthApi
    .get(
      `${NOTIFICATION_MSG_LIST_API_PATH}${isValidString(dateString) && `?${NOTIFIED_DATETIME}=${encodeURIComponent(dateString)}`}`,
    )
    .then((res) => {
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
