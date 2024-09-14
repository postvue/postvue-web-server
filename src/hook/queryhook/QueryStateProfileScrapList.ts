import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_POST_LIST } from 'const/QueryClientConst';
import {
  getMyProfileScrapList,
  GetMyProfileScrapListRsp,
} from 'services/profile/getMyProfileScrapList';

export interface SearchPostQueryInterface {
  pages: GetMyProfileScrapListRsp[];
  pageParams: unknown[];
}

export const QueryStateProfileScrapList = (): UseInfiniteQueryResult<
  SearchPostQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetMyProfileScrapListRsp,
    AxiosError,
    SearchPostQueryInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_PROFILE_POST_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, myScrapLists: [] };
      }

      return getMyProfileScrapList(pageParam);
    },

    getNextPageParam: (lastPage) => {
      // Increment pageParam by 1 for the next page

      return lastPage.cursorId !== ZERO_CURSOR_ID
        ? lastPage.cursorId
        : undefined;
    },

    initialPageParam: INIT_CURSOR_ID,
  });
};
