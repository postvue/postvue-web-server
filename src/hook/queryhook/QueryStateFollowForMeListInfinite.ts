import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_FOLLOW_FOR_ME_LIST } from 'const/QueryClientConst';
import {
  getFollowForMeListByParam,
  GetTasteForMeListRsp,
} from 'services/post/home/getFollowForMeList';

export interface FollowForMeListQueryInterface {
  pages: GetTasteForMeListRsp[];
  pageParams: string[];
}

export const QueryStateFollowForMeListInfinite = (): UseInfiniteQueryResult<
  FollowForMeListQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetTasteForMeListRsp,
    AxiosError,
    FollowForMeListQueryInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_FOLLOW_FOR_ME_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, snsPostRspList: [] };
      }

      return getFollowForMeListByParam(pageParam);
    },

    getNextPageParam: (lastPage) => {
      // Increment pageParam by 1 for the next page
      return lastPage.cursorId !== ZERO_CURSOR_ID
        ? lastPage.cursorId
        : undefined;
    },

    // refetchOnMount: 'always',
    initialPageParam: INIT_CURSOR_ID,
  });
};
