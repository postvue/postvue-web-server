import { api } from '..';
import { MsgInboxMessage } from '../../global/interface/message';
import { MESSAGE_PATH, MSG_INBOX_FOLLOW_LIST_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getMsgInboxMessages = (
  page: number,
): Promise<MsgInboxMessage[]> => {
  return api
    .get(`${MESSAGE_PATH}${MSG_INBOX_FOLLOW_LIST_PATH}?${PAGE_PARAM}=${page}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
