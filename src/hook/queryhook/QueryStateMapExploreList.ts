import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_MAP_EXPLORE_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { getNearForMeList } from 'services/post/getNearForMeList';

export interface MapExploreListInterface {
  pages: PostRsp[][];
  pageParams: unknown[];
}

export const QueryStateMapExploreList = (
  latitude: number,
  longitude: number,
  nearFilter: string,
  startDate: string | null,
  endDate: string | null,
  isActive = true,
  distance?: number,
): UseInfiniteQueryResult<
  MapExploreListInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    PostRsp[],
    AxiosError,
    MapExploreListInterface,
    [string]
  >({
    queryKey: [
      QUERY_STATE_MAP_EXPLORE_LIST +
        '_' +
        nearFilter +
        '_' +
        latitude +
        '_' +
        longitude +
        (startDate || '') +
        '_' +
        (endDate || '') +
        '_' +
        (distance || ''),
    ], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getNearForMeList(
        pageParam,
        latitude,
        longitude,
        nearFilter,
        startDate || '',
        endDate || '',
        distance,
      );
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
    enabled: !!latitude && !!longitude && isActive,
  });
};
