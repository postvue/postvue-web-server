import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_RECOMM_FAVORITTE_TAG_LIST } from 'const/QueryClientConst';
import { RecommTagInfo } from 'global/interface/recomm';
import { getRecommFavoriteTagList } from 'services/recomm/getRecommFavoriteTagList';

export interface RecommFavoriteTagListInterface {
  pages: RecommTagInfo[][];
  pageParams: unknown[];
}

export const QueryStateRecommFavoriteTagList = (): UseInfiniteQueryResult<
  RecommFavoriteTagListInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    RecommTagInfo[],
    AxiosError,
    RecommFavoriteTagListInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_RECOMM_FAVORITTE_TAG_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getRecommFavoriteTagList(pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
  });
};
