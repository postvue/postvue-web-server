import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_MSG_CONVERSATION_LIST } from 'const/QueryClientConst';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import {
  getDirectMsgConversationList,
  GetMsgConversationsRsp,
} from 'services/message/getMsgConversationList';

export interface MsgConversationListInterface {
  pages: GetMsgConversationsRsp[];
  pageParams: unknown[];
}

export const QueryStateMsgConversationListInfinite = (
  targetUserId: string,
): UseInfiniteQueryResult<
  MsgConversationListInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetMsgConversationsRsp,
    AxiosError,
    MsgConversationListInterface,
    [string]
  >({
    queryKey: [
      convertQueryTemplate(QUERY_STATE_MSG_CONVERSATION_LIST, targetUserId),
    ], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, msgConversationRspList: [] };
      }

      return getDirectMsgConversationList(targetUserId, pageParam);
    },

    getNextPageParam: (lastPage) => {
      // Increment pageParam by 1 for the next page
      return lastPage.cursorId !== ZERO_CURSOR_ID
        ? lastPage.cursorId
        : undefined;
    },

    initialPageParam: INIT_CURSOR_ID,
    enabled: isValidString(targetUserId),
    retry: false,
  });
};
