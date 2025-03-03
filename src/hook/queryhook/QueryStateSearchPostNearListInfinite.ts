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
import { getPostSearchNear } from 'services/post/getPostSearchNear';

export interface SearchPostNearQueryInterface {
  pages: GetSearchPostsRsp[];
  pageParams: unknown[];
}

export const QueryStateSearchPostNearListInfinite = (
  searchQueryAndFilterKey: string,
  isActive: boolean,
  latitude?: number,
  longitude?: number,
): UseInfiniteQueryResult<
  SearchPostNearQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetSearchPostsRsp,
    AxiosError,
    SearchPostNearQueryInterface,
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

      const [searchWord, filterQueryPram] = decodeSearhWordAndFilterKey(
        searchQueryAndFilterKey,
      );

      if (latitude && longitude) {
        return getPostSearchNear(searchWord, latitude, longitude, pageParam);
      } else {
        throw new Error();
      }
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page

      return lastPage.snsPostRspList.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,

    enabled: !!searchQueryAndFilterKey && !!latitude && !!longitude && isActive,

    select: (data) => {
      return {
        pages: [...data.pages],
        pageParams: [...data.pageParams],
      };
    },
  });
};
