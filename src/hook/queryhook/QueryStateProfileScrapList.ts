import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_POST_LIST } from 'const/QueryClientConst';
import { ProfileScrapList } from 'global/interface/profile';
import { getProfileScrapList } from 'services/profile/getProfileScrapList';

export interface SearchPostQueryInterface {
  pages: ProfileScrapList[][];
  pageParams: unknown[];
}

export const QueryStateProfileScrapList = (): UseInfiniteQueryResult<
  SearchPostQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    ProfileScrapList[],
    AxiosError,
    SearchPostQueryInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_PROFILE_POST_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getProfileScrapList(pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
  });
};
