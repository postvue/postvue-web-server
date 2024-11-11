import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_POST_MAP_POST_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { getPostMapPostBySrchQry } from 'services/post/getPostMapPostBySrchQry';

export interface PostMapPostInfiniteInterface {
  pages: PostRsp[][];
  pageParams: unknown[];
}

export const QueryStatePostMapPostInfinite = (
  srchQry: string,
  isActive = true,
): UseInfiniteQueryResult<
  PostMapPostInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    PostRsp[],
    AxiosError,
    PostMapPostInfiniteInterface,
    [string]
  >({
    queryKey: [convertQueryTemplate(QUERY_STATE_POST_MAP_POST_LIST, srchQry)], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getPostMapPostBySrchQry(srchQry, pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
    enabled: isValidString(srchQry) && isActive,
    retry: false,
  });
};
