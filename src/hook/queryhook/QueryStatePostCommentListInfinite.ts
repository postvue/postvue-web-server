import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_POST_COMMENT_LIST } from 'const/QueryClientConst';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import {
  getPostComments,
  GetPostCommentsRsp,
} from 'services/post/getPostComments';

export interface PostCommetListInfiniteInterface {
  pages: GetPostCommentsRsp[];
  pageParams: unknown[];
}

export const QueryStatePostCommentListInfinite = (
  postId: string,
): UseInfiniteQueryResult<
  PostCommetListInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetPostCommentsRsp,
    AxiosError,
    PostCommetListInfiniteInterface,
    [string]
  >({
    queryKey: [convertQueryTemplate(QUERY_STATE_POST_COMMENT_LIST, postId)], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, snsPostCommentRspList: [] };
      }

      return getPostComments(postId, pageParam);
    },
    refetchOnMount: 'always',

    getNextPageParam: (lastPage) => {
      // Increment pageParam by 1 for the next page
      return lastPage.cursorId !== ZERO_CURSOR_ID
        ? lastPage.cursorId
        : undefined;
    },
    initialPageParam: INIT_CURSOR_ID,
  });
};
