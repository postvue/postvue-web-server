import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_POST_LIST } from 'const/QueryClientConst';
import {
  getProfilePostListByCursor,
  GetProfilePostListRsp,
} from 'services/profile/getProfilePostList';

export interface ProfilePostListQueryInterface {
  pages: GetProfilePostListRsp[];
  pageParams: unknown[];
}

export const QueryStateProfilePostList = (
  username: string,
): UseInfiniteQueryResult<
  ProfilePostListQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetProfilePostListRsp,
    AxiosError,
    ProfilePostListQueryInterface,
    [string]
  >({
    queryKey: [`${QUERY_STATE_PROFILE_POST_LIST}/${username}`], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, snsPostRspList: [] };
      }

      return getProfilePostListByCursor(username, pageParam);
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
