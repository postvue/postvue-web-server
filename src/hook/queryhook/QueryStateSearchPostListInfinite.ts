import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_SEARCH_POST_LIST } from 'const/QueryClientConst';
import {
  SEARCH_POST_LASTEST_QUERY_PARAM,
  SEARCH_POST_MY_NEAR_QUERY_PARAM,
} from 'const/TabConfigConst';
import { GetSearchPostsRsp } from 'global/interface/search';
import {
  decodeSearhWordAndFilterKey,
  isValidSearchWordAndFilterKey,
} from 'global/util/SearchPostUtil';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { getPostSearchLive } from 'services/post/getPostSearchLive';
import { getPostSearchNear } from 'services/post/getPostSearchNear';
import { getPostSearchPopular } from 'services/post/getPostSearchPopular';

export interface SearchPostQueryInterface {
  pages: GetSearchPostsRsp[];
  pageParams: unknown[];
}

export const QueryStateSearchPostListInfinite = (
  searchQueryAndFilterKey: string,
  latitude?: number,
  longitude?: number,
  isActive = true,
): UseInfiniteQueryResult<
  SearchPostQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetSearchPostsRsp,
    AxiosError,
    SearchPostQueryInterface,
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

      if (filterQueryPram === SEARCH_POST_LASTEST_QUERY_PARAM) {
        return getPostSearchLive(searchWord, pageParam);
      } else if (filterQueryPram === SEARCH_POST_MY_NEAR_QUERY_PARAM) {
        console.log(
          '양호',
          latitude,
          longitude,
          !!searchQueryAndFilterKey && isActive,
        );
        if (!latitude || !longitude) throw new Error();
        return getPostSearchNear(searchWord, latitude, longitude, pageParam);
      } else {
        return getPostSearchPopular(searchWord, pageParam);
      }
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page

      return lastPage.snsPostRspList.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,

    enabled: !!searchQueryAndFilterKey && isActive,

    select: (data) => {
      return {
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      };
    },
  });
};
