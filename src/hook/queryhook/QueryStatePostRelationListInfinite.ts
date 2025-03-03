import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_POST_RELATION_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { isValidString } from 'global/util/ValidUtil';
import { getRecommPostRelation } from 'services/recomm/getRecommPostRelation';

export interface PostRelationListInfiniteInterface {
  pages: PostRsp[][];
  pageParams: number[];
}

export const QueryStatePostRelationListInfinite = (
  postId: string,
  searchType?: string,
  isActive = true,
): UseInfiniteQueryResult<
  PostRelationListInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    PostRsp[],
    AxiosError,
    PostRelationListInfiniteInterface
  >({
    queryKey: [
      QUERY_STATE_POST_RELATION_LIST,
      convertQueryTemplate(searchType || '', postId),
    ], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'number') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return [];
      }
      return getRecommPostRelation(postId, searchType || '', pageParam);
    },

    getNextPageParam: (lastPage, allPages) => {
      // Increment pageParam by 1 for the next page
      return lastPage.length > 0 ? allPages.length : undefined;
    },

    initialPageParam: PAGE_NUM,
    enabled: isActive && isValidString(postId),
    retry: false,
  });
};
