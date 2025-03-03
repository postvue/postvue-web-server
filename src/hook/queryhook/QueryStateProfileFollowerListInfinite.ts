import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_FOLLOWER_LIST } from 'const/QueryClientConst';
import { PostProfileInfoRsp } from 'global/interface/post';
import { isValidString } from 'global/util/ValidUtil';
import { getProfileFollowerList } from 'services/profile/getProfileFollowerList';

export interface ProfileFollowerListInfiniteInterface {
  pages: PostProfileInfoRsp[][];
  pageParams: unknown[];
}

export const QueryStateProfileFollowerListInfinite = (
  username: string,
): UseInfiniteQueryResult<
  ProfileFollowerListInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    PostProfileInfoRsp[],
    AxiosError,
    ProfileFollowerListInfiniteInterface
  >({
    queryKey: [QUERY_STATE_PROFILE_FOLLOWER_LIST, username], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }

      return getProfileFollowerList(username, pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page

      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
    enabled: isValidString(username),
    refetchOnMount: 'always',
    retry: false,
  });
};
