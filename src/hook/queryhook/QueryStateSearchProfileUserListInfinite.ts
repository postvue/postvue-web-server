import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_SEARCH_PROFILE_USER_LIST } from 'const/QueryClientConst';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';

import {
  getProfileSearchUsers,
  GetProfileSearchUsersRsp,
} from 'services/profile/getProfileSearchUsers';

export interface SearchProfileUserListQueryInterface {
  pages: GetProfileSearchUsersRsp[];
  pageParams: unknown[];
}
export const QueryStateSearchProfileUserListInfinite = (
  username: string,
  hasFollowInfo = false,
): UseInfiniteQueryResult<
  SearchProfileUserListQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetProfileSearchUsersRsp,
    AxiosError,
    SearchProfileUserListQueryInterface,
    [string]
  >({
    queryKey: [
      convertQueryTemplate(
        QUERY_STATE_SEARCH_PROFILE_USER_LIST,
        username + (hasFollowInfo ? 'HAS_FOLLOW_INFO' : ''),
      ),
    ], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, getProfileUserByUsernameList: [] };
      }

      return getProfileSearchUsers(username, pageParam, hasFollowInfo);
    },

    getNextPageParam: (lastPage) => {
      // Increment pageParam by 1 for the next page

      return lastPage.cursorId !== ZERO_CURSOR_ID
        ? lastPage.cursorId
        : undefined;
    },

    initialPageParam: INIT_CURSOR_ID,
    retry: false,
    enabled: isValidString(username),
  });
};
