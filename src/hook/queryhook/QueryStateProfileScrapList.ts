import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_SCRAP_LIST } from 'const/QueryClientConst';
import { ProfileThumbnailScrapList } from 'global/interface/profile';
import { getProfileScrapList } from 'services/profile/getProfileScrapList';

export interface ProfileScrapListQueryInterface {
  pages: ProfileThumbnailScrapList[][];
  pageParams: number[];
}

export const QueryStateProfileScrapList = (): UseInfiniteQueryResult<
  ProfileScrapListQueryInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    ProfileThumbnailScrapList[],
    AxiosError,
    ProfileScrapListQueryInterface,
    [string]
  >({
    queryKey: [QUERY_STATE_PROFILE_SCRAP_LIST], // query key
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
