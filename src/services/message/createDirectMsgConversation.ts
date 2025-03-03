import { MSG_DIREACT_CONVERSATION_API_PATH } from 'services/appApiPath';
import { formApi } from '..';

export const createDirectMsgConversation = (
  targetUserId: string,
  formData: FormData,
): Promise<boolean> => {
  return formApi
    .post(`${MSG_DIREACT_CONVERSATION_API_PATH}/${targetUserId}`, formData)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
