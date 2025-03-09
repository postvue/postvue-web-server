import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_SEARCH_POST_LIST } from 'const/QueryClientConst';
import { GetSearchPostsRsp } from 'global/interface/search';
import {
  decodeSearhWordAndFilterKey,
  isValidSearchWordAndFilterKey,
} from 'global/util/SearchPostUtil';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { getPostSearchLive } from 'services/post/getPostSearchLive';

export interface SearchPostRecentlyQueryInterface {
  pages: GetSearchPostsRsp[];
  pageParams: unknown[];
}

export const QueryStateSearchPostRecentlyListInfinite = (
  searchQueryAndFilterKey: string,
  isActive: boolean,
): UseInfiniteQueryResult<
  SearchPostRecentlyQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetSearchPostsRsp,
    AxiosError,
    SearchPostRecentlyQueryInterface,
    [string]
  >({
    queryKey: [
      convertQueryTemplate(
        QUERY_STATE_SEARCH_POST_LIST,
        searchQueryAndFilterKey,
      ),
    ], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (
        typeof pageParam !== 'number' ||
        !isValidString(searchQueryAndFilterKey) ||
        !isValidSearchWordAndFilterKey(searchQueryAndFilterKey)
      ) {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return {
          snsPostRspList: [],
          isBookMarkedFavoriteTerm: false,
          isFetchFavoriteState: false,
        };
      }

      // pageParam이 string인 경우 API 호출을 수행합니다.

      const [searchWord, filterQueryPram] = decodeSearhWordAndFilterKey(
        searchQueryAndFilterKey,
      );

      return getPostSearchLive(searchWord, pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page

      return lastPage.snsPostRspList.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,

    enabled: !!searchQueryAndFilterKey && isActive,

    select: (data) => {
      return {
        pages: [...data.pages],
        pageParams: [...data.pageParams],
      };
    },
  });
};
