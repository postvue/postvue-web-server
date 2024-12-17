import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import {
  QUERY_STATE_MSG_INBOX_LIST,
  STALE_5_MINUTES_TIME,
} from 'const/QueryClientConst';
import { MsgInboxMessage } from 'global/interface/message';
import { getMsgInboxMessages } from 'services/message/getMsgInboxMessages';

export interface MsgInboxListInterface {
  pages: MsgInboxMessage[][];
  pageParams: unknown[];
}

export const QueryStateMsgInboxListInfinite = (
  isActive = true,
): UseInfiniteQueryResult<MsgInboxListInterface, AxiosError<unknown, any>> => {
  return useInfiniteQuery<
    MsgInboxMessage[],
    AxiosError,
    MsgInboxListInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_MSG_INBOX_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }

      return getMsgInboxMessages(pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page

      return lastPage.length > 0
        ? allPages.flatMap((v) => v).length
        : undefined;
    },

    initialPageParam: PAGE_NUM,
    staleTime: STALE_5_MINUTES_TIME,
    enabled: isActive,
  });
};
