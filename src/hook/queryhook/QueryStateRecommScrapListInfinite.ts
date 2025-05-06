import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_RECOMM_SCRAP_LIST } from 'const/QueryClientConst';
import { ProfileThumbnailScrapList } from 'global/interface/profile';
import { getRecommScrapList } from 'services/profile/getRecommScrapList';

export interface SearchScrapQueryInterface {
  pages: ProfileThumbnailScrapList[][];
  pageParams: unknown[];
}

export const QueryStateRecommScrapListInfinite = (
  isActive = true,
): UseInfiniteQueryResult<
  SearchScrapQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    ProfileThumbnailScrapList[],
    AxiosError,
    SearchScrapQueryInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_RECOMM_SCRAP_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getRecommScrapList(pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    enabled: isActive,
    initialPageParam: PAGE_NUM,
  });
};
