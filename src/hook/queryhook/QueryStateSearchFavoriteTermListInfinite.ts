import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_SEARCH_FAVORITE_TERM_LIST } from 'const/QueryClientConst';
import { GetFavoriteTermRsp } from 'global/interface/search';
import { getFavoriteSearchTermList } from 'services/search/getFavoriteSearchTermList';

export interface SearchFavoriteTermListInterface {
  pages: GetFavoriteTermRsp[][];
  pageParams: number[];
}

export const QueryStateSearchFavoriteTermListInfinite =
  (): UseInfiniteQueryResult<
    SearchFavoriteTermListInterface,
    AxiosError<unknown, any>
  > => {
    return useInfiniteQuery<
      GetFavoriteTermRsp[],
      AxiosError,
      SearchFavoriteTermListInterface
    >({
      queryKey: [QUERY_STATE_SEARCH_FAVORITE_TERM_LIST], // query key
      queryFn: async ({ pageParam }) => {
        // pageParam이 string인지 확인

        if (typeof pageParam !== 'number') {
          // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
          return [];
        }

        return getFavoriteSearchTermList(pageParam);
      },

      getNextPageParam: (lastPage, allPages) => {
        // Increment pageParam by 1 for the next page

        return lastPage.length > 0 ? allPages.length : undefined;
      },

      initialPageParam: PAGE_NUM,
    });
  };
