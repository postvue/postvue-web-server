import { optAuthApi } from '..';
import { MsgInboxMessage } from '../../global/interface/message';
import { MSG_CONVERATION_INBOX_LIST_API_PATH } from '../appApiPath';
import { PAGE_PARAM } from '../appApiQueryParam';

export const getMsgInboxMessages = (
  pageNum: number,
): Promise<MsgInboxMessage[]> => {
  return optAuthApi
    .get(`${MSG_CONVERATION_INBOX_LIST_API_PATH}?${PAGE_PARAM}=${pageNum}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
