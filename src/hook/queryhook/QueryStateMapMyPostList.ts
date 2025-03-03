import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_MAP_MY_POST_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { getMapMyPostList } from 'services/maps/getMapMyPostList';

export interface MapMyPostListInterface {
  pages: PostRsp[][];
  pageParams: unknown[];
}

export const QueryStateMapMyPostList = (
  isActive = true,
): UseInfiniteQueryResult<MapMyPostListInterface, AxiosError<unknown, any>> => {
  return useInfiniteQuery<
    PostRsp[],
    AxiosError,
    MapMyPostListInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_MAP_MY_POST_LIST], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getMapMyPostList(pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
    enabled: isActive,
  });
};
