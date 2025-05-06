import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_RECOMM_FOLLOW_LIST } from 'const/QueryClientConst';
import { RecommFollowInfo } from 'global/interface/recomm';
import { getRecommFollowListV1 } from 'services/recomm/getRecommFollowListV1';

export interface RecommFollowListInfiniteInterface {
  pages: RecommFollowInfo[][];
  pageParams: unknown[];
}

export const QueryStateRecommFollowListInfinite = (
  isActive = true,
): UseInfiniteQueryResult<
  RecommFollowListInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    RecommFollowInfo[],
    AxiosError,
    RecommFollowListInfiniteInterface
  >({
    queryKey: [QUERY_STATE_RECOMM_FOLLOW_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getRecommFollowListV1(pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
    enabled: isActive,
    retry: false,
  });
};
