import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_POST_COMMENT_REPLY_LIST } from 'const/QueryClientConst';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import {
  getPostCommentReplies,
  GetPostCommentReplyListRsp,
} from 'services/post/getPostCommentReplies';

export interface PostCommetReplyListInfiniteInterface {
  pages: GetPostCommentReplyListRsp[];
  pageParams: unknown[];
}

export const QueryStatePostCommentReplyListInfinite = (
  postId: string,
  commentId: string,
): UseInfiniteQueryResult<
  PostCommetReplyListInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetPostCommentReplyListRsp,
    AxiosError,
    PostCommetReplyListInfiniteInterface,
    [string]
  >({
    queryKey: [
      convertQueryTemplate(QUERY_STATE_POST_COMMENT_REPLY_LIST, commentId),
    ], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, snsPostCommentRspList: [] };
      }

      return getPostCommentReplies(postId, commentId, pageParam);
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
