import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { INIT_CURSOR_ID, ZERO_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_POST_LIKE_LIST } from 'const/QueryClientConst';
import {
  getPostLikeList,
  GetPostLikeRsp,
} from 'services/post/getPostLiketList';

export interface PostCommetListInfiniteInterface {
  pages: GetPostLikeRsp[];
  pageParams: string[];
}

export const QueryStatePostLikeListInfinite = (
  postId: string,
): UseInfiniteQueryResult<
  PostCommetListInfiniteInterface,
  AxiosError<unknown, any>
> => {
  return useInfiniteQuery<
    GetPostLikeRsp,
    AxiosError,
    PostCommetListInfiniteInterface
  >({
    queryKey: [QUERY_STATE_POST_LIKE_LIST, postId], // query key
    queryFn: async ({ pageParam }) => {
      // pageParam이 string인지 확인

      if (typeof pageParam !== 'string') {
        // pageParam이 유효하지 않은 경우 빈 결과를 반환하거나 에러를 던집니다.
        return { cursorId: ZERO_CURSOR_ID, snsPostLikeGetRspList: [] };
      }

      return getPostLikeList(postId, pageParam);
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
